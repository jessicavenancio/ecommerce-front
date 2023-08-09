import sacolinha from "../../images/LogoBrancoIcone.png";

export function CartIcon({ itemCount }) {
    return (
        <div className="cart-icon">
            <img src={sacolinha} height={25} alt=""/>
            { itemCount > 0 ? (<span className="item-count text-white ms-2 badge rounded-pill bg-danger">{itemCount}</span>):(null)}
        </div>
    )
}