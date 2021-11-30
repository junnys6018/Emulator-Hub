// TODO
/**
 * Returns the uuid of the currently active user
 * if no one is logged in, it is the uuid of the guest account
 * otherwise, it is the uuid of the logged in user
 *
 * Returns `null` if no active user can be found
 */
export default function getActiveUserUuid() {
    return localStorage.getItem('guest-uuid');
}
