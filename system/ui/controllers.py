from typing import *
import config
from .. import api, aaa, l10n, settings
from ..ui import sitemap, screens
from ..requests import Request, JSONResponse
from ..runtime import context


class IUrlConfigurationResponse(TypedDict):
    loginScreenUrl: str
    defaultAuthenticatedUrl: str
    defaultGuestUrl: str


class IAaaConfiguration(TypedDict):
    rememberUsername: bool


@api.handle_get('instantiate')
async def instantiate(request: Request) -> JSONResponse:
    session: aaa.Session = context['session']
    aaa_settings: settings.SettingsCatalog = await settings.get('system.aaa')

    response: dict = {
        'session': session.as_json() if session is not None else None,
        'sitemap': sitemap.as_json(),
        'screens': screens.runtime_json(),
        'locale': l10n.ui_locale_json(),
        'title': config.APP_TITLE,
        'localization': l10n.pack_dictionary(),
        'urlConfiguration': {
            'loginScreenUrl': config.URL['login_screen'],
            'defaultAuthenticatedUrl': config.URL['default_authenticated'] or config.URL['default'],
            'defaultGuestUrl': config.URL['default_guest'] or config.URL['default'],
            'onLogoffUrl': config.URL['on_logoff'] or config.URL['default_guest'] or config.URL['default']
        },
        'aaaConfiguration': {
            'rememberUsername': bool(aaa_settings[aaa.SETTINGS_REMEMBER_USERNAME])
        }
    }
    return JSONResponse(response)
