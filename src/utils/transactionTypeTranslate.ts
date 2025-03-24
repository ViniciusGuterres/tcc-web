import { TRANSACTION_TYPES_VALUES } from "../constants/transactionTypes";

function transactionTypeTranslate(typeKey) {
    return TRANSACTION_TYPES_VALUES[typeKey];
}

export default transactionTypeTranslate;