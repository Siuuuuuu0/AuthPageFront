import { apiSlice } from "../../app/api/apiSlice";
import { setAccount } from "./accountSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        updateAccount: builder.mutation({
            query: initialUserData => ({
                url: '/update',
                method: 'PATCH',
                body: {
                    ...initialUserData
                }
            })
        }),
        deleteAccount: builder.mutation({
            query: ({ id }) => ({
                url: `/update`,
                method: 'DELETE',
                body : {...id}
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(setAccount(null));
                } catch (err) {
                    console.log(err);
                }
            }
        }),
        getAccount: builder.query({
            query: ({ id }) => ({
                url: `/users/:${id}`,
                method: 'GET'
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setAccount(data));
                } catch (err) {
                    console.log(err);
                }
            }
        }), 
        confirmUpdatePassword : builder.mutation({
            query : ({token}) => ({
                url : `/update/update-password/:${token}`, 
                method : 'PATCH', 
            }),
        }), 
        confirmUpdateEmail : builder.mutation({
            query : ({token}) => ({
                url : `/update/update-email/:${token}`, 
                method : 'PATCH', 
            })
        }), 
    })
});

export const {
    useUpdateAccountMutation,
    useDeleteAccountMutation,
    useGetAccountQuery, 
    useConfirmUpdatePasswordMutation, 
    useConfirmUpdateEmailMutation
} = accountApiSlice;
