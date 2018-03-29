const util = {
    componentsType: (csType: string) => {
        return require(`../BaseComponent/demo/${csType}`).default;
    }
};

export default util;
