from django.contrib import admin

from .models import Artist,Album,Library,PlayList,FavoriteList,Genre,Song,PodcastCategory,Podcast,Episode,Plan,Suscription,Ads,defaultData

admin.site.register(Artist)
admin.site.register(Album)
admin.site.register(Library)
admin.site.register(PlayList)
admin.site.register(FavoriteList)
admin.site.register(Genre)
admin.site.register(Song)
admin.site.register(PodcastCategory)
admin.site.register(Podcast)
admin.site.register(Episode)
admin.site.register(Plan)
admin.site.register(Suscription)
admin.site.register(Ads)
admin.site.register(defaultData)

