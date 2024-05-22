const fs = require("fs")
const path = require("path")
const urlencode = require("urlencode")
let { setAppInfo, getAppInfo } = require("../config/ssr-md.config")
const useFileDb = require("../db/useFileDb")
const { genHtmlsByRouters } = require("../lib/router-tools")
const { deleteFolderRecursive, deepCreateDir } = require("../lib/fs-utils")
const { renderCommonHtml, } = require("../lib/html-tools")
const { zipFold, unzipFold } = require("../lib/zip")
const appDb = useFileDb("app.json")


// -------------------------------------------------  modules --------------------------------------------------------

const module_controllers = [...require("./modules/bookmark"), ...require("./modules/site")]

module.exports = [
    {
        index: ["/pass"],
        service: (params, config) => {
            const { getPassordMd, getNextExpire } = require("../lib/usePass")(config)
            const { password } = params
            if (config.admin_password === password) {
                return {
                    success: 1,
                    pass: getPassordMd(password)
                }
            } else {
                return {
                    success: 0,
                    message: '密码错误'
                }
            }
        },
        send: (response, params, result, config) => {
            const { getPassordMd, getNextExpire } = require("../lib/usePass")(config)
            if (result.success === 1) {
                response.setHeader('Set-Cookie', ['pass=' + result.pass, getNextExpire(), 'HttpOnly']); // ⑤
                response.setHeader('Cache-Control', 'no-cache'); // ⑤
                response.writeHead(301, { 'Location': '/' });
            } else {
                response.writeHead(301, { 'Location': (config.password_index || "/auth.html") + `?success=0&message=${urlencode.encode('密码错误')}` });
            }
            return response.end()
        }
    }, {
        index: ["/api/admin/upload",],
        service: async (params) => {
            const urls = []
            const keys = Object.keys(params.uploads)
            for (const key of keys) {
                urls.push(params.uploads[key])
            }
            return {
                success: 1,
                message: '上传成功',
                url: urls.join(',')
            }
        },
        send: (response, params, result) => {
            return response.endJson(result)
        }
    }, {
        index: ["/api/admin/savesetting"],
        service: params => {
            const {
                osstype, useoss,
                ACCESS_KEY_ID, ACCESS_KEY_SECRET, REGION, BUCKET,
            } = params
            return setAppInfo({
                ...appDb.getAll().data[0],
                osstype,
                useoss: useoss === 'true',
                ACCESS_KEY_ID, ACCESS_KEY_SECRET, REGION, BUCKET,
            })
        },
        send: (response, params, result, config) => {
            // console.log(request)
            response.writeHead(301, { 'Location': `${response.req.headers["referer"]}?success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}` });
            return response.end()
        }
    }, {
        index: ["/api/admin/savepassword"],
        service: params => {
            const { password, confirmPassword, need_password, } = params
            if (need_password === 'true') {
                if (!/\w{6,20}/.test(password)) {
                    return {
                        success: 0,
                        message: '请输入6-20位有效密码'
                    }
                }
                if (password !== confirmPassword) {
                    return {
                        success: 0,
                        message: '两次密码输入不一致'
                    }
                }
                return setAppInfo({
                    ...appDb.getAll().data[0],
                    admin_password: password,
                    need_password: true,
                })
            } else {
                return setAppInfo({
                    ...appDb.getAll().data[0],
                    // admin_password: password,
                    need_password: false,
                })
            }
        },
        send: (response, params, result, config) => {
            // console.log(request)
            response.writeHead(301, { 'Location': `${response.req.headers["referer"]}?success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}` });
            return response.end()
        }
    },

    ...module_controllers,
]
