const addCountAction = number => ({
    type: '+',
    number
});

export const addCount = number => {
    return addCountAction(number);
};
