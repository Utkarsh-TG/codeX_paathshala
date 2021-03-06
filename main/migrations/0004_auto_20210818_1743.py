# Generated by Django 3.2.3 on 2021-08-18 12:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_practice_material'),
    ]

    operations = [
        migrations.CreateModel(
            name='Doubts',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user', models.CharField(max_length=122)),
                ('content', models.CharField(max_length=2048)),
                ('tags', models.JSONField()),
                ('responses', models.JSONField()),
                ('votes', models.JSONField()),
                ('_id', models.CharField(max_length=128)),
                ('date', models.DateField()),
            ],
        ),
        migrations.AlterField(
            model_name='practice_material',
            name='subject',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='practice_material',
            name='title',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='study_material',
            name='subject',
            field=models.CharField(max_length=128),
        ),
        migrations.AlterField(
            model_name='study_material',
            name='title',
            field=models.CharField(max_length=128),
        ),
    ]
