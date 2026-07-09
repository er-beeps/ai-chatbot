from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
from django.contrib.auth.models import Group, Permission
from authentication.models import User  # Adjust if custom User model
from master.models import Province  # Assuming Province is in 'master' app


class Command(BaseCommand):
    help = 'Seed initial data, groups, and users for a specific tenant schema (or all if not provided)'

    def handle(self, *args, **options):

        # 1. Load master data if empty
        if Province.objects.count() == 0:
            self.stdout.write("  - Loading master data...")
            call_command('loaddata', 'master/seed/master.json', verbosity=0)

        # 2. Create Groups + Permissions
        self.stdout.write("  - Creating groups...")
        super_admin_group, _ = Group.objects.get_or_create(name='Super Admin')
        admin_group, _ = Group.objects.get_or_create(name='Admin')
        normal_user_group, _ = Group.objects.get_or_create(name='Normal User')

        super_admin_group.permissions.set(Permission.objects.all())
        admin_group.permissions.set(Permission.objects.all())

        # 3. Create Users
        self.stdout.write("  - Creating users...")
        
        # super_admin
        if not User.objects.filter(username='superadmin').exists():
            super_user = User.objects.create_superuser(
                username='superadmin',
                password='Super@5678',
                email=f'super@admin.com'
            )
            super_user.groups.add(super_admin_group)
            
            print(f"✅ Super Admin User Created")
            
        # central_admin
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_user(
                username='admin',
                password='Admin@1234',
                email='admin@admin.com'
            )
            admin_user.groups.add(admin_group)
            print(f"✅ Admin user created ")
            
        # normal_user
        if not User.objects.filter(username='normaluser').exists():
            normal_user_user = User.objects.create_user(
                username='normaluser',
                password='Admin@1234',
                email='normaluser@admin.com'
            )
            normal_user_user.groups.add(normal_user_group)
            print(f"✅ Normal  user created ")
            
        self.stdout.write(self.style.SUCCESS(f"  ✔ User Creation Done with default roles"))
