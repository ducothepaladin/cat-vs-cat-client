import API from "@/api/axios"


export const getFriends = async() => {

    try {
        const response = await API.get(`/user/get-friends`);
        return response.data.content;
    } catch(err) {
        console.log(err);
    }
}


export const addNewFriend = async( friendEmail: string) => {
    try {
        const response = await API.patch(`/user/add-friend`, {
            email: friendEmail
        });
        return response.data;
    } catch (err) {
        console.log(err);
    }
}


export const getUser = async() => {
    try {
        const response = await API.get(`/user/get-user/by-id`);
        return response.data.content.user;
    } catch (err) {
        console.log(err)
    }
}