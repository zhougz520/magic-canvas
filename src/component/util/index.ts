const util = {
    componentsType: (csType: string) => {
        return require(`../${csType}`).default;
    }
};

export default util;
