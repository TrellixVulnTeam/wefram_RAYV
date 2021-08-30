from typing import *
from system import ds, aaa
from .routines import *


__all__ = [
    'build'
]


async def make_random_user() -> aaa.User:
    first_name: str
    middle_name: str
    last_name: str
    gender: str
    first_name, middle_name, last_name, gender = make_random_fullname()

    login: str = ('.'.join([last_name, ''.join([s[0] for s in (first_name, middle_name) if s])])).lower()

    return aaa.User(
        login=login,
        secret=aaa.hash_password(make_random_password()),
        locked=False,
        available=True,
        first_name=first_name,
        middle_name=middle_name,
        last_name=last_name
    )


async def make_random_users(qty: int) -> None:
    logins: List[str] = []
    users: List[aaa.User] = []

    n: int = 0
    while n < qty:
        user: aaa.User = await make_random_user()
        if user.login in logins:
            continue
        n += 1
        logins.append(user.login)
        users.append(user)
    [ds.db.add(o) for o in users]


async def build() -> None:
    await make_random_users(100)

