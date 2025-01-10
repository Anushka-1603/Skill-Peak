from django.db import models

# Create your models here.
class UserProfile(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=150, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
class UserHandler(models.Model):
    LEETCODE = 'LC'
    GITHUB = 'GH'
    PLATFORMS = [
        (LEETCODE, 'Leetcode'),
        (GITHUB, 'Github'),
    ]
    
    handlername = models.CharField(max_length=100)
    handlerid = models.CharField(max_length=100) #handler's userid on the platform
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE) #user who added this handler
    platform = models.CharField(max_length=2, choices=PLATFORMS)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.handlername} - {self.get_platform_display()}"
    
class IndividualStats(models.Model):
    handlerid = models.ForeignKey(UserHandler, on_delete=models.CASCADE)
    contributions = models.IntegerField(default=0)
    submissions = models.IntegerField(default=0)
    recorded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        if self.handlerid.platform == UserHandler.GITHUB:
            return f"{self.handlerid.handlername}: {self.contributions} contributions"
        elif self.handlerid.platform == UserHandler.LEETCODE:
            return f"{self.handlerid.handlername}: {self.submissions} submissions"