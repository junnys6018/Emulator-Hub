/**
 * Returns the uuid of the currently active (logged in) user
 *
 * Returns `null` if no user is logged in
 */
export default function getActiveUserUuid() {
    return localStorage.getItem('active-uuid');
}
