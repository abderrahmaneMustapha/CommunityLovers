from graphene_django import DjangoObjectType
from .models import Event, EventJoinRequest
from .forms import EventCreationForm
import graphene
from graphql_jwt.decorators import login_required
from graphene_django.forms.mutation import DjangoModelFormMutation


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
    get_community_events_by_slug = graphene.List(EventType, slug=graphene.String())
    get_current_event = graphene.Field(EventType, id=graphene.ID())

    def resolve_all_events(root, info):
        return Event.objects.all()

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
        if(info.context.user.pk ==root.event.event_creator.owner.pk):
            return root.event
        else:
            Event.objects.get(pk = root.event.pk).delete()
            raise Exception("You dont have permission to performe this action")

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
        return EventJoinRequest(community_join_req=event_join_req, success=success)



class EventRequestAcceptMutation(graphene.Mutation):
    class Arguments: 
        id = graphene.ID()
    
    success  = graphene.Boolean()
    event_join_req= graphene.Field(EventJoinRequestType)

    @login_required
    def mutate(root, info, id):      
        event_join_req = Event.objects.filter(id=id)
        
        if (event_join_req.first().get_event_owner() == info.context.user):
            join_req =  event_join_req.update(accepted =True)
            community_join_req = community_join_req.first()
            success = True
        else:
            community_join_req = None
            success = False
        return EventRequestAcceptMutation(community_join_req=community_join_req, success=success)
     
### main mutation
class Mutation(graphene.ObjectType):
    add_event =  EventsMutation.Field()
