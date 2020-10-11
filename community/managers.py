from django.db.models import Manager

class CommunityJoinRequestManager(Manager):
    
    def get_community_owner(self):
        return self.member