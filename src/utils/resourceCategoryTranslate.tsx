import { RESOURCE_CATEGORY_VALUES } from "../constants/resourceCategory";

function resourceCategoryTranslate(categoryKey) {
    return RESOURCE_CATEGORY_VALUES[categoryKey];
}

export default resourceCategoryTranslate;
