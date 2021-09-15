from system.ui import screens, sitemap
from .. import aaa, mail
from .const import (
    APP_ID,
    APP_ICON,
    SITEMAP_CAPTION,
    PROPS_CAPTION,
    PROPS_ICON,
    PERMISSION_ADMINISTERING,
    PERMISSION_PROPS
)


__all__ = [
    'SettingsScreen',
    'UsersScreen',
    'RolesScreen',
    'RoleScreen',
    'AuthBackendAdDomainsScreen'
]


SITEMAP_FOLDER_ID: str = APP_ID

sitemap.append(
    SITEMAP_FOLDER_ID,
    SITEMAP_CAPTION,
    icon=APP_ICON,
    requires=PERMISSION_ADMINISTERING,
    order=99999
)


@screens.register(sitemap=SITEMAP_FOLDER_ID)
class SettingsScreen(screens.Screen):
    component = 'containers/SettingsScreen'
    route = '/properties'
    parent = APP_ID
    icon = PROPS_ICON
    requires = PERMISSION_PROPS
    caption = PROPS_CAPTION
    order = 10


@screens.register(sitemap=SITEMAP_FOLDER_ID)
class UsersScreen(screens.Screen):
    component = 'containers/UsersScreen'
    route = '/users'
    parent = APP_ID
    icon = aaa.ICON_USERS
    requires = aaa.PERMISSION_ADMINUSERSROLES
    caption = aaa.MSG_USERS
    order = 20


@screens.register(sitemap=SITEMAP_FOLDER_ID)
class RolesScreen(screens.Screen):
    component = 'containers/RolesScreen'
    route = '/roles'
    parent = APP_ID
    icon = aaa.ICON_ROLES
    requires = aaa.PERMISSION_ADMINUSERSROLES
    caption = aaa.MSG_ROLES
    order = 30


@screens.register
class RoleScreen(screens.Screen):
    component = 'containers/RoleScreen'
    parent = APP_ID
    route = '/roles/{key}'
    requires = aaa.PERMISSION_ADMINUSERSROLES


@screens.register(sitemap=SITEMAP_FOLDER_ID)
class AuthBackendAdDomainsScreen(screens.Screen):
    component = 'containers/AuthBackendAdDomains'
    route = '/auth/domains'
    parent = APP_ID
    icon = aaa.ICON_DOMAINS
    requires = aaa.PERMISSION_ADMINUSERSROLES
    caption = aaa.MSG_DOMAINS
    order = 40


@screens.register(sitemap=SITEMAP_FOLDER_ID)
class MailAccountsScreen(screens.Screen):
    component = 'containers/MailAccounts'
    route = '/mail/accounts'
    parent = APP_ID
    icon = mail.APP_ICON
    requires = mail.PERMISSION
    caption = mail.MSG_APP_CAPTION
    order = 50
