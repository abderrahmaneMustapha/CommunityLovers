from graphene_django import DjangoObjectType
import graphene
from graphql_jwt.decorators import login_required
from graphene_django.forms.mutation import DjangoModelFormMutation

from base.models import CustomUser
from community.models import Community, CommunityOwner, CommunityJoinRequest  
from .froms import CommunityCreationForm, CommunityOwnerCreationForm, CommunityJoinRequestCreationForm


class CommunityType(DjangoObjectType):
    class Meta :
        model = Community
        fields = ['id','name', 'slug', 'created_at']


class CommunityOwnerType(DjangoObjectType):
    class Meta :
        model = CommunityOwner
        fields = ['id','owner', 'community', 'created_at']

class CommunityJoinRequestCreationType(DjangoObjectType):
    class  Meta :
        model = CommunityJoinRequest
        fields = ['id', 'community', 'member']

## mutations
class CommunitysMutation(DjangoModelFormMutation):
    community =  graphene.Field(CommunityType)

    @login_required
    def resolve_community(root, info, **kwargs):
        return root.community

    class Meta:
        form_class = CommunityCreationForm

class CommunitysOwnersMutation(DjangoModelFormMutation):
    community_owner =  graphene.Field(CommunityOwnerType)

    @login_required
    def resolve_community_owner(root, info, **kwargs):
        return root.community_owner

    class Meta:
        form_class = CommunityOwnerCreationForm

class CommunityJoinRequestCreationMutation(graphene.Mutation):
    class Arguments: 
        community = graphene.ID()
    
    success  = graphene.Boolean()
    community_join_req= graphene.Field(CommunityJoinRequestCreationType)

    @login_required
    def mutate(root, info, community):
        community_join_req = CommunityJoinRequest.objects.create(community=Community.objects.get(id=community), member=info.context.user)
        success = True
        return CommunityJoinRequestCreationMutation(community_join_req=community_join_req, success=success)

class CommunityJoinRequestAcceptMutation(graphene.Mutation):
    class Arguments :
        id = graphene.ID()
    
    success  = graphene.Boolean()
    community_join_req= graphene.Field(CommunityJoinRequestCreationType)

    @login_required
    def mutate(root, info, id):      
        community_join_req = CommunityJoinRequest.objects.filter(id=id)
        
        if (community_join_req.first().get_community_owner() == info.context.user):
            join_req =  community_join_req.update(accepted =True)
            community_join_req = community_join_req.first()
            success = True
        else:
            community_join_req = None
            success = False
        return CommunityJoinRequestAcceptMutation(community_join_req=community_join_req, success=success)
     
### main mutation
class Mutation(graphene.ObjectType):
    add_community = CommunitysMutation.Field()
    add_owner_to_community = CommunitysOwnersMutation.Field()
    add_community_join_request = CommunityJoinRequestCreationMutation.Field()
    accept_community_join_request = CommunityJoinRequestAcceptMutation.Field()
    



### main query
class Query(graphene.ObjectType):
    all_communitys = graphene.List(CommunityType)
    get_communitys_by_id = graphene.List(CommunityType, id=graphene.Int())
    get_communitys_by_slug = graphene.Field(CommunityOwnerType, slug=graphene.String())
    all_communitys_owners = graphene.List(CommunityOwnerType)
    get_current_community_owner = graphene.Field(CommunityOwnerType, slug=graphene.String())
    get_current_user_communitys = graphene.List(CommunityOwnerType)
    get_community_members = graphene.List(CommunityJoinRequestCreationType, slug=graphene.String())
    get_community_join_requests = graphene.List(CommunityJoinRequestCreationType, slug=graphene.String())
    
    @login_required
    def resolve_all_communitys(root, info):
        return Community.objects.all()
    
    @login_required
    def resolve_get_community_members(root, info, slug):
        return CommunityJoinRequest.objects.filter(community__slug=slug, accepted=True)
    
    @login_required
    def resolve_get_community_join_requests(root, info, slug):
        return CommunityJoinRequest.objects.filter(community__slug=slug, accepted=False)

    #@login_required
    def resolve_all_communitys_owners(root, info):
        return CommunityOwner.objects.all()
    
    @login_required
    def resolve_get_current_user_communitys(root, info):
        return CommunityOwner.objects.filter(owner__email=info.context.user)
    @login_required
    def resolve_get_current_community_owner_for_community(root, info, slug):
        return CommunityOwner.objects.filter(community__slug=slug)

    @login_required
    def resolve_get_communitys_by_id(root, info, id):
        return Community.objects.filter(id=id)
    
    @login_required
    def resolve_get_communitys_by_slug(root, info, slug):
        return CommunityOwner.objects.get(community__slug=slug)