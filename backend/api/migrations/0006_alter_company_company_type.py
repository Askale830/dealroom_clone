# Generated by Django 5.1.4 on 2025-06-06 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_accelerator_hub_incubator_university'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='company_type',
            field=models.CharField(blank=True, choices=[('Startup', 'Startup'), ('SME', 'Small & Medium Enterprise'), ('Corporation', 'Corporation'), ('Non-profit', 'Non-profit'), ('Government', 'Government')], max_length=50, null=True),
        ),
    ]
