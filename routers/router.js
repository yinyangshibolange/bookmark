const { getAppInfo } = require("../config/ssr-md.config")

const urlencode = require("urlencode")
const useFileDb = require("../db/useFileDb")
const categoryDb = useFileDb("category.json")
const groupDb = useFileDb("group.json")
const bookmarkDb = useFileDb("bookmark.json")
const fs = require("fs")
const path = require("path")
const cheerio = require("cheerio")

const siteConfigDb = useFileDb("siteConfig.json")
module.exports = [{
    title: "错误页",
    meta: "",
    index: ["/error", "/error.html"],
    path: "htmls/error.ejs",
    'Cache-Control': 'no-cache',
    renderData: {
        message: query => query.message
    }
}, {
    title: "密码认证",
    meta: "",
    index: ["/auth", "/auth.html"],
    path: "htmls/auth.ejs",
    'Cache-Control': 'no-cache',
}, {
    nav: true,
    title: "书签导航转换器",
    meta: "",
    index: "/",
    path: "htmls/index.ejs",
    'Cache-Control': 'no-cache',
    renderData: {
        type: params => params.type,
        id: params => params.id,
        categorys: params => {
           return categoryDb.getAll().data || []
        },
        groupList: params=> {
            const {id} = params
            let groupsRes
            if(!id) {
                groupsRes = groupDb.getAll()
            } else {
                groupsRes =  groupDb.getItems({
                    categoryId: id
                })
            }
            if(groupsRes.success === 1) {
                return (groupsRes.data || []).map(item => {
                    const bookmarkRes = bookmarkDb.getItems({
                        groupId: item.id
                    })
                    return {
                        ...item,
                        bookmarks: bookmarkRes.data || [],
                    }
                })
            }
            return []
        }
    }
},
{
    title: "内容管理",
    meta: "",
    index: ["/manager", "/manager.html"],
    path: "htmls/manager.ejs",
    'Cache-Control': 'no-cache',
    renderData: {
        appInfo: () => {
            return getAppInfo()
        },
        sitePackageExist: async () => {
            try {
                const tmpPath = path.resolve(process.cwd(), '___tmp___')
                const site_output_zip = path.resolve(tmpPath, 'site_export_tmp.zip')
                const fileExist = await fs.promises.stat(site_output_zip)
                return fileExist.isFile()
            } catch (err) {
                return false
            }
        },
        siteConfig: async () => {
            const siteConfig = siteConfigDb.getAll().data[0]
            const { title, banner, custom_css } = siteConfig || {}
            return {
                title, banner, custom_css,
            }
        }
    }
}
   , {
        genSite: true,
        meta: "",
        index: "/index.html",
        path: "htmls/preview.ejs",
        'Cache-Control': 'no-cache',
        renderData: {
            type: params => params.type,
            id: params => params.id,
            categorys: params => {
                return categoryDb.getAll().data || []
            },
            groupList: params=> {
                const {id} = params
                let groupsRes
                if(!id) {
                    groupsRes = groupDb.getAll()
                } else {
                    groupsRes =  groupDb.getItems({
                        categoryId: id
                    })
                }
                if(groupsRes.success === 1) {
                    return (groupsRes.data || []).map(item => {
                        const bookmarkRes = bookmarkDb.getItems({
                            groupId: item.id
                        })
                        return {
                            ...item,
                            bookmarks: bookmarkRes.data || [],
                        }
                    })
                }
                return []
            },
            siteConfig: async () => {
                const siteConfig = siteConfigDb.getAll().data[0]
                const { title, banner, custom_css } = siteConfig || {}
                return {
                    title, banner, custom_css,
                }
            }
        }
    }
]
