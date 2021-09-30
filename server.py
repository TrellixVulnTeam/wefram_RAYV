import uvicorn
import env
import config


if __name__ == '__main__':
    from system import asgi
    if not config.PRODUCTION:
        from system import ui
        from manage import make

        make.make_statics_only()
        ui.views.init_view_public_assets()
    uvicorn.run(
        asgi,
        host=config.UVICORN_BIND,
        port=config.UVICORN_PORT,
        debug=not config.PRODUCTION,
        loop=config.UVICORN_LOOP
    )
