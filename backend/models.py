from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import datetime
# from PIL import Image


def upload_dir(instance, filename):
    _today = datetime.now().strftime('%m%d%Y')
    _id = instance.pk or 'new'
    return f'profile_img/{_id}_{_today}_{filename}'


class Expert(models.Model):
    name = models.CharField(max_length=50)
    university = models.CharField(max_length=50)
    department = models.CharField(max_length=100)
    img = models.ImageField(upload_to=upload_dir, null=True, blank=True)
    rate = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(5.0)])
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, verbose_name='Last Update')

    def __str__(self):
        return self.name

    # def save(self, *args, **kwargs):
    #     super(Expert, self).save(*args, **kwargs)
    #     image = Image.open(self.img.path)
    #     image = image.resize((200, 200))
    #     image.save(self.img.path)


class Tutorial(models.Model):
    expert = models.OneToOneField(Expert, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    hours = models.IntegerField()
    price = models.IntegerField()
    description = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True, verbose_name='Last Update')

    def __str__(self):
        return self.title
