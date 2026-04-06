from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def migrate_status_to_phase(apps, schema_editor):
    User = apps.get_model('auth', 'User')
    Phase = apps.get_model('api', 'Phase')
    Task = apps.get_model('api', 'Task')

    STATUS_MAP = [
        ('pending',     'Pending',     '#ba1a1a', 0, False),
        ('in_progress', 'In Progress', '#515f74', 1, False),
        ('completed',   'Completed',   '#005237', 2, True),
    ]

    for user in User.objects.all():
        phase_map = {}
        for status_key, name, color, order, is_terminal in STATUS_MAP:
            phase = Phase.objects.create(
                owner=user, name=name, color=color, order=order, is_terminal=is_terminal
            )
            phase_map[status_key] = phase

        for task in Task.objects.filter(owner=user):
            task.phase = phase_map.get(task.status, phase_map['pending'])
            task.save()


def reverse_migrate(apps, schema_editor):
    Task = apps.get_model('api', 'Task')
    for task in Task.objects.select_related('phase').all():
        if task.phase:
            name = task.phase.name.lower().replace(' ', '_')
            if name in ('pending', 'in_progress', 'completed'):
                task.status = name
            else:
                task.status = 'pending'
            task.save()


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0002_subtask'),
    ]

    operations = [
        # 1. Create Phase model
        migrations.CreateModel(
            name='Phase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('color', models.CharField(default='#6750a4', max_length=7)),
                ('order', models.PositiveIntegerField(default=0)),
                ('is_terminal', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='phases', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['order', 'created_at'],
            },
        ),
        # 2. Add nullable phase FK to Task
        migrations.AddField(
            model_name='task',
            name='phase',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name='tasks',
                to='api.phase',
            ),
        ),
        # 3. Data migration: create default phases per user + map tasks
        migrations.RunPython(migrate_status_to_phase, reverse_migrate),
        # 4. Remove old status field
        migrations.RemoveField(
            model_name='task',
            name='status',
        ),
    ]
