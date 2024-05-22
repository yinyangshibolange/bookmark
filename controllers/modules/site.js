
const path = require("path")
const fs = require("fs")
const useFileDb = require("../../db/useFileDb")
const {genHtmlsByRouters} = require("../../lib/router-tools");
const {deepCreateDir} = require("../../lib/fs-utils");
const {renderCommonHtml} = require("../../lib/html-tools");
const urlencode = require("urlencode")
const {zipFold} = require("../../lib/zip");
const routers = require("../../routers/router") || []
const siteConfigDb = useFileDb("siteConfig.json")


module.exports = [ {
    index: ['/api/admin/postSiteConfig'],
    service: params => {
        let siteConfig = siteConfigDb.getAll().data[0] || {}
        // const { typeViewers } = siteConfig || {}
        const newTypeViewers = []
        Object.keys(params).forEach(key => {
            if (key.startsWith("type_")) {
                newTypeViewers.push({
                    type: key.replace("type_", ""),
                    show: params[key] === 'true'
                })
            }
            if(key === 'title') {
                siteConfig.title = params[key]
            }
            if(key === 'uploads') {
                siteConfig = Object.assign(siteConfig, params[key])
            }
        })
        siteConfig.typeViewers = newTypeViewers
        // console.log(newTypeViewers)
        return siteConfigDb.replaceAll([siteConfig])
    },
    send: (response, params, result, config) => {
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}?success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
},{
    // nocache: true,
    index: ["/api/admin/exportHtml"],
    service: async (params, config) => {
        const tmpPath = path.resolve(process.cwd(), '___tmp___')
        const site_output_zip = path.resolve(tmpPath, 'site_export_tmp.zip')
        return {
            success: 1,
            data: site_output_zip,
        }
    },
    send: (response, params, result, config) => {
        // console.log(result)
        fs.createReadStream(result.data).pipe(response)
        // file_part_download(result.data, response.req, response)
    }
}, { // /api/admin/genSite
    // nocache: true,
    index: ["/api/admin/genSite"],
    service: async (params, config) => {
        const tmpPath = path.resolve(process.cwd(), '___tmp___')
        const site_output_zip = path.resolve(tmpPath, 'site_export_tmp.zip')
        const static_fold_path = path.resolve(process.cwd(), config.static_fold,)
        const exportRouter = "/site"
        try {
            await fs.promises.mkdir(tmpPath)
        } catch (err) {
        }
        try {
            await fs.promises.mkdir(path.resolve(static_fold_path, '.' + exportRouter))
        } catch (err) {
        }
        // 将所有hmtl导出到/static

        const htmls = await genHtmlsByRouters(routers)

        for (let k = 0; k < htmls.length; k++) {
            const item = htmls[k]
            // console.log(item)
            if(item.genSite === true) {
                await deepCreateDir(deepCreateDir, item.index)
                const htmlContent = await renderCommonHtml(item, item.index, urlencode.decode(item.index.replace(/\?.*/, ""), 'utf8'))
                await fs.promises.writeFile(path.resolve(static_fold_path, '.' + item.index), htmlContent)
            }
        }
        // renderCommonHtml
        const res = await zipFold(site_output_zip, static_fold_path)
        return {
            success: 1,
            data: site_output_zip,
            message: '生成成功'
        }
    },
    send:  (response, params, result, config) => {
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}?success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
}, ]
