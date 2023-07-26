import { PUBLIC_PUSHER_CLUSTER, PUBLIC_PUSHER_KEY } from "$env/static/public";
import Pusher from "pusher-js";

var pusher = new Pusher(PUBLIC_PUSHER_KEY, {
    cluster: PUBLIC_PUSHER_CLUSTER,
    userAuthentication: {
        endpoint: '/api/pusher/user-auth',
        transport: "ajax"
    },
    authEndpoint: '/api/pusher/auth'
});

export default pusher;