import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addNewFriend, getFriends, getUser } from "../services/userServices"


export const useGetFriends = () => {

    return useQuery({
        queryKey: ['friends'],
        queryFn: getFriends
    })
}

export const useAddFriend = () => {

    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { friendEmail: string }) => addNewFriend( data.friendEmail),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['friends']})
        }
    })
}

export const getUserById = () => {

    return useQuery({
        queryKey: ['user'],
        queryFn: getUser
    })
}