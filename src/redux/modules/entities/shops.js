import createReducer from "../../../utils/createReducer";

export const schema = {
    name: 'shops',
    id: 'id'
}

const reducer = createReducer(schema.name)

//selectors
export const getShopById=(state, id) => {
    const shop = state.entities.shops[id]
    return shop
}


export default reducer;