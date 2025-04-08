import { PRODUCT_STATE } from "../constants/productState";

function productStateTranslate(categoryKey) {
    return PRODUCT_STATE[categoryKey];
}

export default productStateTranslate;
