const { JSDOM } = require('jsdom');


const getProdoData = (html) => {
    const protoData = {};

    Object.keys(Object.getPrototypeOf(html)).map(k => {
        const protoD = html.getAttribute(k);
        if (protoD) {
            protoData[k] = protoD;
        }

    });

    return protoData
}



const search = (t, s, e) => {;




    if (s && e) {
        let elng = e.length;
        s = t.indexOf(s);
        e = t.indexOf(e);
        t = t.slice(s, e + elng);
        // t = t.slice(s, e + e.length);



        // return t.slice(, t.indexOf(e) + e.length)
    } else if (s && !e) {
        s = t.indexOf(s);
        t = t.slice(s);
        // return t.slice(t.indexOf(s))
    } else if (!s && e) {
        let elng = e.length;
        e = t.indexOf(e);
        t = t.slice(0, e + elng);
        // return t.slice(0, t.indexOf(e) + e.length)
    }

    return [t, s, e]
}

const stringTOhtml = (str) => {
    return new JSDOM(str)
}

const gHtml = (html) => {
    return html.outerHTML
}


module.exports = {
    search,
    getProdoData,
    stringTOhtml,
    gHtml

};