import { useState } from "react";
import { useRouter } from "./RouterContext"
import { config } from "./Routes";
import E404 from "./404";
import MetaProvider from "./MetaContext";

const Handle_Exeptions = (path) => {
    if (path.trim() == '/') {
        path = ""
    }

    return path
}




const splitPath = (path) => path.split("/").filter(r => r != "");


export default function Router() {
    const { History } = useRouter();
    const [page, setCompo] = useState("");


    const getParams = (c, route, path_data) => {


        let paramaux = 0;
        let validator = true;


        splitPath(c.path.cleared).map((cpath, j) => {




            if (cpath.includes('p|')) {

                if (path_data.param == undefined) {
                    path_data.param = {}
                }



                validator &&= params_manager(path_data.param, c.path.param.param[paramaux], route[j])
                paramaux++

            }
        })
        return validator

    }

    const getQuery = (search, path_data) => {
        const urlParams = new URLSearchParams(search);

        // Convierte los parámetros a un objeto
        const paramsObject = {};
        for (const [key, value] of urlParams.entries()) {
            paramsObject[key] = value;
        }




        path_data.query = paramsObject;
    }


    const HandleEmptyPath = (path, search) => {

        // const regex = /(?<!\S)\/\{p\|[a-zA-Z0-9_]+\}(?!\/)(?=\s|$)|(?<!\S)\{p\|[a-zA-Z0-9_]+\}(?=\s|$)/g;
        const regex = /^\/?(\{p\|[a-zA-Z0-9_]+\}\/?)*$/;
        let coincidences = [];
        const empty_routes_path = History.filter(h => regex.test(h.path.cleared))

        path = splitPath(path);

        const path_data = {};


        for (let i = 0; i < empty_routes_path.length; i++) {
            const erpath = splitPath(empty_routes_path[i].path.cleared);



            let query = path.filter(p => p.includes("?"))[0];

            if (!query && window.location.href.includes("?")) {
                query = window.location.href.substring(window.location.href.indexOf("?"));

            }
            path = path.filter(p => !p.includes("?"));


            if (erpath.length == path.length) {
                if (search) {
                    getQuery(search, path_data)
                } else if (query) {
                    getQuery(query, path_data)
                }

                getParams(empty_routes_path[i], path, path_data)

                coincidences.push({ pd: empty_routes_path[i], data: path_data })


            }



        }


        if (coincidences.length == 1) {
            const data = coincidences[0].data;
            delete coincidences[0].data
            return { bool: true, data: { path: coincidences[0], ...data } }
        } else if (coincidences.length > 1) {

            return { bool: false }

        } else {
            return { bool: false }
        }


    }


    const params_manager = (path_data, param, value = "") => {
        switch (param.type) {
            case "string":
                if (value.trim().length > 0) {
                    path_data[param.name] = value
                    return true
                }
                break
            case "int":
                if (!isNaN(parseInt(value))) {
                    path_data[param.name] = parseInt(value)
                    return true
                }
                break
            case "float":
                if (!isNaN(parseFloat(value))) {
                    path_data[param.name] = parseFloat(value)
                    return true
                }
                break
            case "bt":
            case "bigint":
                if (!isNaN(parseFloat(value))) {
                    path_data[param.name] = parseFloat(value)
                    return true
                }
                break
            default:
                break;
        }
        return false

    }

    const validate_route = (rtcomp, route,) => {
        const paramdata = rtcomp.pd.path.param.param.map(({ name, type }) => { return { name, type } });
        const pathdata = splitPath(rtcomp.pd.path.cleared)
        let selected = true;
        route.map((r, i) => {
            if (pathdata[i].includes("p|")) {
                const indP = paramdata.filter(pd => pd.name == (pathdata[i].replace("{p|", "")).replace("}", ""))[0];
                selected &&= params_manager({}, indP, r)
            } else {
                selected &&= r == pathdata[i]

            }

        })
        if (selected) {
            return rtcomp;
        }
    }

    const component_loader = (meta, compo) => {

        setCompo({ compo, meta })

    }



    let route_found;
    if (History.length > 0) {
        let { pathname, hash, search } = window.location;
        pathname = pathname.replace(config.gh_repo, "");
        hash = hash.replace(config.gh_repo, "");
        pathname = Handle_Exeptions(pathname);
        hash = Handle_Exeptions(hash);
        const path_data = { param: {} };





        const search_route = (route) => {
            let route_origin = route.cleared;


            route = splitPath(route);

            let query = route.filter(p => p.includes("?"))[0];

            if (!query && window.location.href.includes("?")) {
                query = window.location.href.substring(window.location.href.indexOf("?"));

            }
            route = route.filter(p => !p.includes("?"));




            let coincidences = [];
            const final = [];
            route.map((r, i) => {
                History.map(h => {
                    const hp = splitPath(h.path.cleared);
                    if (hp[i] == r && coincidences.indexOf(h) == -1) {
                        coincidences.push(h)
                    }
                })


            })



            coincidences.map((c, i) => {

                if (route.length == splitPath(c.path.cleared).length) {
                    final.push(c);
                }

            })

            let pathSelected;

            if (final.length == 1) {
                pathSelected = { pd: final[0] }




            } else if (final.length > 1) {


                let filtrated = []

                final.map(c => {
                    const disco = splitPath(c.path.cleared)


                    // FIRTS FILTER

                    let priority = 0


                    for (let i = 0; i < disco.length; i++) {
                        const di = disco[i];



                        if (di.trim() != route[i].trim() && !di.includes("p|") && !di.includes("q|")) {

                            break;
                        }

                        if (di.trim() == route[i].trim() && !di.includes("p|") && !di.includes("q|")) {
                            priority += 2
                        } else if (di.includes("p|") && di.includes("int")) {
                            priority += 1
                        } else {
                            priority += 0
                        }




                        if (i == disco.length - 1) {

                            filtrated.push({ path: disco[i], priority, pd: c })
                        }
                    }



                })




                if (filtrated.length == 1) {
                    pathSelected = filtrated[0];
                } else if (filtrated.length > 1) {
                    // VALIDATE PARAMS

                    //PRIORITY 1
                    let err;
                    (filtrated.sort((a, b) => a.priority - b.priority)).reverse();
                    const P1 = filtrated.filter(p => p.pd.path.param.param.findIndex(pd => pd.type == "int") != -1)[0];
                    const paramdata = P1.pd.path.param.param.map(({ name, type }) => { return { name, type } });
                    const pathdata = splitPath(P1.pd.path.cleared)
                    if (P1) {

                        pathSelected = validate_route(P1, route) || pathSelected




                    }


                    if (filtrated[0].pd.path.cleared != P1.pd.path.cleared) {

                        pathSelected = validate_route(filtrated[0], route) || pathSelected
                    }


                    if (!pathSelected) {

                        for (let i = 0; i < filtrated.length; i++) {
                            pathSelected = validate_route(filtrated[i], route) || pathSelected
                            if (pathSelected) {
                                break
                            }
                        }
                    }



                }
            }





            if (pathSelected) {


                if (getParams(pathSelected.pd, route, path_data)) {
                    if (search) {
                        getQuery(search, path_data)
                    } else if (query) {
                        getQuery(query, path_data)
                    }
                    path_data['path'] = pathSelected;
                    return { bool: true, data: path_data }
                } else {
                    return { bool: false, data: 400 }
                }


            } else {
                return { bool: false, data: 404 }
            }




        }



        if (typeof page == 'string') {

            if (hash.length > 0) {
                hash = hash.replace("#/", "");

                route_found = search_route(hash)
                if (route_found.bool) {
                    route_found["compo"] = route_found.data.path.pd.compo;
                }




                // SPECIAL CASES!

                if (!route_found.bool) {
                    route_found = HandleEmptyPath(hash, search)

                }
                // SPECIAL CASES!
            } else {
                route_found = search_route(pathname)
                if (route_found.bool) {
                    route_found["compo"] = route_found.data.path.pd.compo;
                }

                if (!route_found.bool) {
                    route_found = HandleEmptyPath(pathname, search)

                }

            }
            // if (pathname.length > 0) {
            //     route_found = search_route(pathname)
            //     if (route_found.bool) {
            //         route_found["compo"] = route_found.data.path.pd.compo;
            //     }


            // } else if (hash.length > 0) {
            //     hash = hash.replace("#/", "");

            //     route_found = search_route(hash)
            //     if (route_found.bool) {
            //         route_found["compo"] = route_found.data.path.pd.compo;
            //     }




            //     // SPECIAL CASES!

            //     if (!route_found.bool) {
            //         route_found=  HandleEmptyPath(hash, search)

            //     }
            //     // SPECIAL CASES!
            // } else {

            //     route_found = History.filter(p => p.path.cleared.trim() == "")[0];

            //     if (route_found) {
            //         route_found["bool"] = true;
            //         route_found["path"] = route_found;
            //         route_found["compo"] = route_found.compo;
            //     }

            //     // if (route_found) {
            //     //     component_loader(route_found.compo)
            //     // } else {
            //     //     component_loader(<E404/>)
            //     // }

            // }
            

            if (route_found.bool) {
                if(route_found.data.path.pd.compo){
                    component_loader(route_found, route_found.data.path.pd.compo)
                }else if( route_found.data.path.pd.path.redirect){
                    window.location.href = route_found.data.path.pd.path.redirect;
                }
            } else {
                component_loader(route_found, <E404 />)
            }


        }


    }



    return <>
        <MetaProvider metadata={page.meta}>
            {page.compo}
        </MetaProvider>

    </>
}