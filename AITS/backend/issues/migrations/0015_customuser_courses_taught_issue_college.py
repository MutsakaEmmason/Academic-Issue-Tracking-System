from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('issues', '0014_remove_customuser_courses_taught'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='courses_taught',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='issue',
            name='college',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
