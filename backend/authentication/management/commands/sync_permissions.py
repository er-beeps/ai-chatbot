from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.apps import apps
from django.contrib.auth.management import create_permissions
from django_tenants.utils import get_tenant_model, schema_context


class Command(BaseCommand):
    help = 'Sync all model permissions to Super Admin and Admin groups for all tenants'

    def handle(self, *args, **options):

            self.stdout.write(self.style.NOTICE(f"Processing command"))

            # Ensure all permissions exist (for new models)
            for app_config in apps.get_app_configs():
                create_permissions(app_config, verbosity=0)

            super_group, _ = Group.objects.get_or_create(name='Super Admin')
            admin_group, _ = Group.objects.get_or_create(name='Admin')

            # Full access for super admins
            super_permissions = Permission.objects.all()

            # Example: Admins cannot delete
            admin_permissions = Permission.objects.exclude(codename__startswith='delete_')

            super_group.permissions.set(super_permissions)
            admin_group.permissions.set(admin_permissions)

            self.stdout.write(self.style.SUCCESS(f"  ✔ Synced permissions "))
