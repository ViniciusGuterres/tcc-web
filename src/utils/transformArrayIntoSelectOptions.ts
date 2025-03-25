function transformArrayIntoSelectOptions(array, value, label) {
    if (!array || !Array.isArray(array) || !array?.length || !value || !label) return null;

    const optionsArr: Array<Option> = [];

    for (let i = 0; i < array.length; i++) {
        const currentRow = array[i];

        optionsArr.push({
            value: currentRow[value],
            label: currentRow[label],
        });
    }

    return optionsArr;
}

export default transformArrayIntoSelectOptions;