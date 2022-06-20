/// <reference path="./custom.d.ts" />
// tslint:disable
/**
 * WebCrawler
 * This is a web crawler.
 *
 * OpenAPI spec version: 1.0.1-oas3
 * 
 *
 * NOTE: This file is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the file manually.
 */

import * as url from "url";
import * as isomorphicFetch from "isomorphic-fetch";
import { Configuration } from "./configuration";

const BASE_PATH = "/".replace(/\/+$/, "");

/**
 *
 * @export
 */
export const COLLECTION_FORMATS = {
    csv: ",",
    ssv: " ",
    tsv: "\t",
    pipes: "|",
};

/**
 *
 * @export
 * @interface FetchAPI
 */
export interface FetchAPI {
    (url: string, init?: any): Promise<Response>;
}

/**
 *
 * @export
 * @interface FetchArgs
 */
export interface FetchArgs {
    url: string;
    options: any;
}

/**
 *
 * @export
 * @class BaseAPI
 */
export class BaseAPI {
    protected configuration?: Configuration;

    constructor(configuration?: Configuration, protected basePath: string = BASE_PATH, protected fetch: FetchAPI = isomorphicFetch) {
        if (configuration) {
            this.configuration = configuration;
            this.basePath = configuration.basePath || this.basePath;
        } else {
          this.configuration = undefined;
        }
    }
};

/**
 *
 * @export
 * @class RequiredError
 * @extends {Error}
 */
export class RequiredError extends Error {
    public name: string = "RequiredError"

    constructor(public field: string, msg?: string) {
        super(msg);
    }
}

/**
 * 
 * @export
 * @interface ExecutionsBody
 */
export interface ExecutionsBody {
    /**
     * 
     * @type {number}
     * @memberof ExecutionsBody
     */
    recordId: number;
}
/**
 * 
 * @export
 * @interface InlineResponse200
 */
export interface InlineResponse200 {
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse200
     */
    success?: boolean;
    /**
     * 
     * @type {Array<any>}
     * @memberof InlineResponse200
     */
    records?: Array<any>;
}
/**
 * 
 * @export
 * @interface InlineResponse2001
 */
export interface InlineResponse2001 {
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse2001
     */
    success?: boolean;
    /**
     * 
     * @type {any}
     * @memberof InlineResponse2001
     */
    record?: any;
}
/**
 * 
 * @export
 * @interface InlineResponse2002
 */
export interface InlineResponse2002 {
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse2002
     */
    success?: boolean;
    /**
     * 
     * @type {Array<any>}
     * @memberof InlineResponse2002
     */
    executions?: Array<any>;
}
/**
 * 
 * @export
 * @interface InlineResponse2003
 */
export interface InlineResponse2003 {
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse2003
     */
    success?: boolean;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2003
     */
    id?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2003
     */
    recId?: number;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2003
     */
    executionStatus?: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003
     */
    startTime?: string;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse2003
     */
    endTime?: string;
    /**
     * 
     * @type {number}
     * @memberof InlineResponse2003
     */
    crawledSites?: number;
}
/**
 * 
 * @export
 * @interface InlineResponse201
 */
export interface InlineResponse201 {
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse201
     */
    success?: boolean;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse201
     */
    message?: string;
}
/**
 * 
 * @export
 * @interface InlineResponse418
 */
export interface InlineResponse418 {
    /**
     * 
     * @type {boolean}
     * @memberof InlineResponse418
     */
    success?: boolean;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse418
     */
    reason?: string;
}
/**
 * 
 * @export
 * @interface RecordsBody
 */
export interface RecordsBody {
    /**
     * 
     * @type {string}
     * @memberof RecordsBody
     */
    url?: string;
    /**
     * 
     * @type {string}
     * @memberof RecordsBody
     */
    regEx: string;
    /**
     * 
     * @type {string}
     * @memberof RecordsBody
     */
    periodicity?: string;
    /**
     * 
     * @type {string}
     * @memberof RecordsBody
     */
    label?: string;
    /**
     * 
     * @type {boolean}
     * @memberof RecordsBody
     */
    active?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof RecordsBody
     */
    tags?: Array<string>;
}
/**
 * 
 * @export
 * @interface RecordsRecIDBody
 */
export interface RecordsRecIDBody {
    /**
     * 
     * @type {string}
     * @memberof RecordsRecIDBody
     */
    url?: string;
    /**
     * 
     * @type {string}
     * @memberof RecordsRecIDBody
     */
    regEx: string;
    /**
     * 
     * @type {string}
     * @memberof RecordsRecIDBody
     */
    periodicity?: string;
    /**
     * 
     * @type {string}
     * @memberof RecordsRecIDBody
     */
    label?: string;
    /**
     * 
     * @type {boolean}
     * @memberof RecordsRecIDBody
     */
    active?: boolean;
    /**
     * 
     * @type {Array<string>}
     * @memberof RecordsRecIDBody
     */
    tags?: Array<string>;
}
/**
 * DefaultApi - fetch parameter creator
 * @export
 */
export const DefaultApiFetchParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create new execution without values
         * @param {ExecutionsBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createExecution(body: ExecutionsBody, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createExecution.');
            }
            const localVarPath = `/executions`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"ExecutionsBody" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Create new record without values
         * @param {RecordsBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createRecord(body: RecordsBody, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling createRecord.');
            }
            const localVarPath = `/records`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'POST' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"RecordsBody" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Delete record with id
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteRecord(recID: number, options: any = {}): FetchArgs {
            // verify required parameter 'recID' is not null or undefined
            if (recID === null || recID === undefined) {
                throw new RequiredError('recID','Required parameter recID was null or undefined when calling deleteRecord.');
            }
            const localVarPath = `/records/{recID}`
                .replace(`{${"recID"}}`, encodeURIComponent(String(recID)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'DELETE' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get execution by id
         * @param {number} execID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getExecution(execID: number, options: any = {}): FetchArgs {
            // verify required parameter 'execID' is not null or undefined
            if (execID === null || execID === undefined) {
                throw new RequiredError('execID','Required parameter execID was null or undefined when calling getExecution.');
            }
            const localVarPath = `/executions/{execID}`
                .replace(`{${"execID"}}`, encodeURIComponent(String(execID)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get all executions
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getExecutions(options: any = {}): FetchArgs {
            const localVarPath = `/executions`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get record by id
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecord(recID: number, options: any = {}): FetchArgs {
            // verify required parameter 'recID' is not null or undefined
            if (recID === null || recID === undefined) {
                throw new RequiredError('recID','Required parameter recID was null or undefined when calling getRecord.');
            }
            const localVarPath = `/records/{recID}`
                .replace(`{${"recID"}}`, encodeURIComponent(String(recID)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get all records
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecords(options: any = {}): FetchArgs {
            const localVarPath = `/records`;
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'GET' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Update record with id
         * @param {RecordsRecIDBody} body 
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateRecord(body: RecordsRecIDBody, recID: number, options: any = {}): FetchArgs {
            // verify required parameter 'body' is not null or undefined
            if (body === null || body === undefined) {
                throw new RequiredError('body','Required parameter body was null or undefined when calling updateRecord.');
            }
            // verify required parameter 'recID' is not null or undefined
            if (recID === null || recID === undefined) {
                throw new RequiredError('recID','Required parameter recID was null or undefined when calling updateRecord.');
            }
            const localVarPath = `/records/{recID}`
                .replace(`{${"recID"}}`, encodeURIComponent(String(recID)));
            const localVarUrlObj = url.parse(localVarPath, true);
            const localVarRequestOptions = Object.assign({ method: 'PUT' }, options);
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            localVarHeaderParameter['Content-Type'] = 'application/json';

            localVarUrlObj.query = Object.assign({}, localVarUrlObj.query, localVarQueryParameter, options.query);
            // fix override query string Detail: https://stackoverflow.com/a/7517673/1077943
            delete localVarUrlObj.search;
            localVarRequestOptions.headers = Object.assign({}, localVarHeaderParameter, options.headers);
            const needsSerialization = (<any>"RecordsRecIDBody" !== "string") || localVarRequestOptions.headers['Content-Type'] === 'application/json';
            localVarRequestOptions.body =  needsSerialization ? JSON.stringify(body || {}) : (body || "");

            return {
                url: url.format(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Create new execution without values
         * @param {ExecutionsBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createExecution(body: ExecutionsBody, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse201> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).createExecution(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Create new record without values
         * @param {RecordsBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createRecord(body: RecordsBody, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse201> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).createRecord(body, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Delete record with id
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteRecord(recID: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse201> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).deleteRecord(recID, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Get execution by id
         * @param {number} execID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getExecution(execID: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse2003> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).getExecution(execID, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Get all executions
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getExecutions(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse2002> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).getExecutions(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Get record by id
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecord(recID: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse2001> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).getRecord(recID, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Get all records
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecords(options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse200> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).getRecords(options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
        /**
         * 
         * @summary Update record with id
         * @param {RecordsRecIDBody} body 
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateRecord(body: RecordsRecIDBody, recID: number, options?: any): (fetch?: FetchAPI, basePath?: string) => Promise<InlineResponse201> {
            const localVarFetchArgs = DefaultApiFetchParamCreator(configuration).updateRecord(body, recID, options);
            return (fetch: FetchAPI = isomorphicFetch, basePath: string = BASE_PATH) => {
                return fetch(basePath + localVarFetchArgs.url, localVarFetchArgs.options).then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
            };
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, fetch?: FetchAPI, basePath?: string) {
    return {
        /**
         * 
         * @summary Create new execution without values
         * @param {ExecutionsBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createExecution(body: ExecutionsBody, options?: any) {
            return DefaultApiFp(configuration).createExecution(body, options)(fetch, basePath);
        },
        /**
         * 
         * @summary Create new record without values
         * @param {RecordsBody} body 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createRecord(body: RecordsBody, options?: any) {
            return DefaultApiFp(configuration).createRecord(body, options)(fetch, basePath);
        },
        /**
         * 
         * @summary Delete record with id
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        deleteRecord(recID: number, options?: any) {
            return DefaultApiFp(configuration).deleteRecord(recID, options)(fetch, basePath);
        },
        /**
         * 
         * @summary Get execution by id
         * @param {number} execID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getExecution(execID: number, options?: any) {
            return DefaultApiFp(configuration).getExecution(execID, options)(fetch, basePath);
        },
        /**
         * 
         * @summary Get all executions
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getExecutions(options?: any) {
            return DefaultApiFp(configuration).getExecutions(options)(fetch, basePath);
        },
        /**
         * 
         * @summary Get record by id
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecord(recID: number, options?: any) {
            return DefaultApiFp(configuration).getRecord(recID, options)(fetch, basePath);
        },
        /**
         * 
         * @summary Get all records
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getRecords(options?: any) {
            return DefaultApiFp(configuration).getRecords(options)(fetch, basePath);
        },
        /**
         * 
         * @summary Update record with id
         * @param {RecordsRecIDBody} body 
         * @param {number} recID 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        updateRecord(body: RecordsRecIDBody, recID: number, options?: any) {
            return DefaultApiFp(configuration).updateRecord(body, recID, options)(fetch, basePath);
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary Create new execution without values
     * @param {ExecutionsBody} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public createExecution(body: ExecutionsBody, options?: any) {
        return DefaultApiFp(this.configuration).createExecution(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Create new record without values
     * @param {RecordsBody} body 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public createRecord(body: RecordsBody, options?: any) {
        return DefaultApiFp(this.configuration).createRecord(body, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Delete record with id
     * @param {number} recID 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public deleteRecord(recID: number, options?: any) {
        return DefaultApiFp(this.configuration).deleteRecord(recID, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Get execution by id
     * @param {number} execID 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getExecution(execID: number, options?: any) {
        return DefaultApiFp(this.configuration).getExecution(execID, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Get all executions
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getExecutions(options?: any) {
        return DefaultApiFp(this.configuration).getExecutions(options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Get record by id
     * @param {number} recID 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getRecord(recID: number, options?: any) {
        return DefaultApiFp(this.configuration).getRecord(recID, options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Get all records
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getRecords(options?: any) {
        return DefaultApiFp(this.configuration).getRecords(options)(this.fetch, this.basePath);
    }

    /**
     * 
     * @summary Update record with id
     * @param {RecordsRecIDBody} body 
     * @param {number} recID 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public updateRecord(body: RecordsRecIDBody, recID: number, options?: any) {
        return DefaultApiFp(this.configuration).updateRecord(body, recID, options)(this.fetch, this.basePath);
    }

}