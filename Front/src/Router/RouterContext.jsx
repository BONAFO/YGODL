
import Routes from "./Routes"


const getType = (type) => {
    if (type != undefined) {
        type = ((type.replace('<', "")).replace('>', "")).toLowerCase();
        switch (type) {
            case 'str':
                return "string";

            case 'int':
                return "int";


            case "bt":
            case "bigint":
                return "bigint";
            default:
                break;
        }
    }
}
const depurate_path = (pathdata) => {
    
   let path = pathdata.path.trim()
    // original => original , cl => limpia // 
    delete pathdata.path
    path = {
        ... pathdata,
        original: path,
        cleared: path,
        query: {
            original: path.substring(path.indexOf('?')),
            param: path.substring(path.indexOf('?') + 1).split("&").map(query => {
                const query_obj = {
                    original: query,
                    name: query.replace("&", "").split("<")[0],
                    type: getType((query.replace("&", "").split("<")[1])
                        ? "<" + query.replace("&", "").split("<")[1]
                        : undefined)
                };
                return query_obj
            })
        },
        param: {
            original: path.substring(path.indexOf(':'), (path.indexOf('?') != -1) ? (path.indexOf('?')) : (undefined)),

            param: (
                (path.substring(
                    path.indexOf(':'), (path.indexOf('?') != -1)
                    ? (path.indexOf('?'))
                    : (undefined)).split("/"))
                    .filter(param => param.trim().length > 0))
                .map(param => {

                    if (param.includes(':')) {
                        const param_obj = {
                            original: param,
                            name: param.replace(":", "").split("<")[0],
                            type: getType((param.replace(":", "").split("<")[1])
                                ? "<" + param.replace(":", "").split("<")[1]
                                : undefined)
                        };
                        return param_obj
                    }


                }).filter(param => param != undefined)
        }
    };

    if (path.param.original.trim().length <= 0) {
        delete path.param
    } else {
        path.param.param.map((param, i) => {
            path.cleared = path.cleared.replace(param.original, `{p|${param.name}}`);
        })

    }

    if (!path.query.original.includes("?")) {
        delete path.query
    } else {
        path.query.param.map((query, i) => {
            path.cleared = path.cleared.replace(query.original, `{q|${query.name}}`);
        })

    }


    return path
}



const { createContext, useContext, useState, useEffect } = require("react");




export const RouterContext = createContext();

export const useRouter = () => useContext(RouterContext);
let louded = false;
const RouterProvider = ({ children }) => {

    const [History, useHistory] = useState([]);



    

    useEffect(() => {

        /* eslint-disable */
        const h = [];
        Routes.map(r => h.push({ path: depurate_path(r), compo: r.e }))


        useHistory(h);
        /* eslint-enable */

    }, []);

    return <RouterContext.Provider value={{ History }}>{children}</RouterContext.Provider>
}

export default RouterProvider