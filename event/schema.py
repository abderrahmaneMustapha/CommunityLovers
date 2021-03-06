from graphene_django import DjangoObjectType
from .models import Event, EventJoinRequest
from .forms import EventCreationForm
import graphene
from graphql_jwt.decorators import login_required
from graphene_django.forms.mutation import DjangoModelFormMutation
from graphql import GraphQLError
from datetime import datetime
class EventType(DjangoObjectType):
    class Meta:
        model = Event
        fields = ['id','name', 'slug', 'event_creator', 'description', 'position', 'start_at', 'end_at']

class EventJoinRequestType(DjangoObjectType):
     class Meta:
        model = EventJoinRequest
        fields = '__all__'


class Query(graphene.ObjectType):
    all_events = graphene.List(EventType)
    get_all_past_events = graphene.List(EventType)
    get_all_current_events = graphene.List(EventType)
    get_all_upcoming_events = graphene.List(EventType)
    get_community_events_by_slug = graphene.List(EventType, slug=graphene.String())
    get_current_event = graphene.Field(EventType, id=graphene.ID())
    get_event_request_pending = graphene.List(EventJoinRequestType, id=graphene.ID())
    get_event_request_accepted = graphene.List(EventJoinRequestType, id=graphene.ID())

    def resolve_all_events(root, info):
        return Event.objects.filter(is_accepted=True)

    def resolve_get_all_current_events(root, info):
        today = datetime.date(datetime.now())
        return Event.objects.filter(is_accepted=True, start_at__lte=today, end_at__gte=today)
    
 
    def resolve_get_all_past_events(root, info):
        today = datetime.date(datetime.now())
        return Event.objects.filter(is_accepted=True, start_at__lt=today, end_at__lt=today)

    @login_required
    def resolve_get_all_upcoming_events(root, info):
        today = datetime.date(datetime.now())  
        return Event.objects.filter(is_accepted=True, start_at__gt=today,end_at__gt=today)
    
    @login_required
    def resolve_get_event_request_pending(root, info, id):
        return EventJoinRequest.objects.filter(event__id=id, accepted=False)

    @login_required
    def resolve_get_event_request_accepted(root, info, id):
          return EventJoinRequest.objects.filter(event__id=id, accepted=True)

    def resolve_get_community_events_by_slug(root, info , slug):
        return Event.objects.filter(event_creator__community__slug=slug)
    
    @login_required
    def resolve_get_current_event(root, info, id):
        return Event.objects.get(pk=id)
    


######## mutations ########
class EventsMutation(DjangoModelFormMutation):
    event =  graphene.Field(EventType)

    @login_required
    def resolve_event(root, info, **kwargs):
        today = datetime.date(datetime.now())
        if   root.event.start_at  < today  or root.event.end_at < today : 
            Event.objects.get(pk = root.event.pk).delete()
            raise Exception("Wrong start at or end at date")
            return None
        if   root.event.start_at  > root.event.end_at :             
            Event.objects.get(pk = root.event.pk).delete()
            raise Exception("Wrong start at or end at date")
            return None
        if(info.context.user.pk ==root.event.event_creator.owner.pk):
            return root.event
        else:
            Event.objects.get(pk = root.event.pk).delete()
            raise Exception("Permission denied")

    class Meta:
        form_class = EventCreationForm

class EventJoinRequestCreationMutation(graphene.Mutation):
    
    class Arguments: 
        event_id = graphene.ID()
    
    success  = graphene.Boolean()
    event_join_req= graphene.Field(EventJoinRequestType)

    @login_required
    def mutate(root, info, event_id):
        event_join_req = EventJoinRequest.objects.create(event=Event.objects.get(id=event_id), member=info.context.user)
        success = True
        return EventJoinRequestCreationMutation(event_join_req=event_join_req, success=success)



class EventRequestAcceptMutation(graphene.Mutation):
    class Arguments: 
        id = graphene.ID()
    
    success  = graphene.Boolean()
    event_join_req= graphene.Field(EventJoinRequestType)

    @login_required
    def mutate(root, info, id):      
        event_join_req = EventJoinRequest.objects.filter(id=id)
        
        if (event_join_req.first().get_event_owner() == info.context.user):
            join_req =  event_join_req.update(accepted =True)
            event_join_req = event_join_req.first()
            success = True
        else:
            raise GraphQLError('Permission denied')
            event_join_req = None
            success = False
        return EventRequestAcceptMutation(event_join_req=event_join_req, success=success)
     
### main mutation
class Mutation(graphene.ObjectType):
    add_event =  EventsMutation.Field()
    create_event_join_request = EventJoinRequestCreationMutation.Field()
    accept_event_join_request = EventRequestAcceptMutation.Field()
