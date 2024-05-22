const urlencode = require("urlencode")
const useFileDb = require("../../db/useFileDb")
const categoryDb = useFileDb("category.json")
const groupDb = useFileDb("group.json")
const bookmarkDb = useFileDb("bookmark.json")
const fs = require("fs")
const path = require("path")
const cheerio = require("cheerio")

module.exports = [{
    index: ['/api/admin/addCategory'],
    service: async (parmas) => {
        if (!parmas.name) {
            return {
                success: 0,
                message: '名称不能为空'
            }
        }
        return categoryDb.addItem({
            name: parmas.name,
            sort: parmas.sort || 0,
        }, ['name'])
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}${response.req.headers["referer"].indexOf("?") > -1 ? '&' : "?"}success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
},  {
    index: ['/api/admin/deleteCategory'],
    service: async params => {
        const groups = groupDb.getItems({
            categoryId: params.id
        })
        groups.data.forEach(group => {
            bookmarkDb.deleteItem({
                groupId: group.id
            })
        })
         groupDb.deleteItem({
            categoryId: params.id
        })
        return categoryDb.deleteItem({
            id: params.id
        })
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        return response.endJson(result)
    }
},{
    index: ['/api/admin/updateCategory'],
    service: async params => {
         return categoryDb.updateItem({
            id: params.id,
            name: params.name,
        })
    },
    send: (response, params, result, config) => {
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}${response.req.headers["referer"].indexOf("?") > -1 ? '&' : "?"}success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }

}, {
    index: ['/api/admin/clearCategory'],
    service: async params => {
        const groups = groupDb.getItems({
            categoryId: params.categoryId
        })
        groups.data.forEach(group => {
            bookmarkDb.deleteItem({
                groupId: group.id
            })
        })
        return groupDb.deleteItem({
            categoryId: params.categoryId
        })
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        return response.endJson(result)
    }
},{
    disableoss: true,
    index: ['/api/admin/importbookmarks'],
    service: async (params, config) => {
        try {
            const {uploads, categoryId} = params
            const {bookmark} = uploads || {}
            const html_byte = await fs.promises.readFile(path.resolve(process.cwd(), config.static_fold, '.' + bookmark))
            const $ = cheerio.load(html_byte.toString());
            const groups = {}
            $("dl > dt > a").each((index, el) => {
                var groupName = $(el).closest("dl").siblings("h3").text() || "未分组"
                var bookmarkItem = {
                    name: $(el).text(),
                    icon: $(el).attr("icon") || $(el).find('img').attr("src"),
                    href: $(el).attr("href"),
                    sort: 0,
                }
                if (!groups[groupName]) {
                    groups[groupName] = [bookmarkItem]
                } else {
                    groups[groupName].push(bookmarkItem)
                }
            })
            Object.keys(groups).forEach(item => {
                const {success, data} = groupDb.addItem({
                    name: item,
                    sort: 0,
                    categoryId,
                }, ['name'])
                if(success === 1) {
                    const groupId = data.id
                    bookmarkDb.addItems(groups[item].map(item => {
                        return {
                            ...item,
                            groupId,
                        }
                    }))
                }
            })
            return {
                success: 1,
                message: "导入完成"
            }
        } catch (err) {
            return {
                success: 0,
                message: err.message,
            }
        }
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}${response.req.headers["referer"].indexOf("?") > -1 ? '&' : "?"}success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
}, {
    index: ['/api/admin/getGroupBookmarks'],
    service: async params => {
        const {categoryId} = params
        const groupsRes =  groupDb.getItems({
            categoryId,
        })
        if(groupsRes.success === 1) {
            return {
                success: 1,
                data: groupsRes.data.map(item => {
                    const bookmarkRes = bookmarkDb.getItems({
                        groupId: item.id
                    })
                    return {
                        ...item,
                        bookmarks: bookmarkRes.data || [],
                    }
                }),
                message: ''
            }
        } else {
            return {
                success: 0,
                message: 'error'
            }
        }

    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        return response.endJson(result)
    }
}, {
    index: ['/api/admin/deleteGroup'],
    service: async params => {
        const res = bookmarkDb.deleteItem({
            groupId: params.groupId,
        })
        groupDb.deleteItem({
            id:  params.groupId,
        })
        return {
            success: 1,
            message: '删除成功'
        }
    },
    send: (response, params, result, config) => {

        return response.endJson(result)
    }

}, {
    index: ["/api/admin/addGroup"],
    service: async  params => {
        return groupDb.addItem({
            name: params.name,
            categoryId: params.categoryId,
            sort: params.sort,
        }, ['name'])
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}${response.req.headers["referer"].indexOf("?") > -1 ? '&' : "?"}success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
}, {
    index: ["/api/admin/updateGroup"],
    service: async  params => {
        return groupDb.updateItem({
            id: params.id,
            name: params.name,
            categoryId: params.categoryId,
            sort: params.sort,
        }, ['name'])
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}${response.req.headers["referer"].indexOf("?") > -1 ? '&' : "?"}success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
} , {
    index: ["/api/admin/addBookmark"],
    service: async  params => {
        return bookmarkDb.addItem({
            name: params.name,
            icon: params.uploads.icon,
            href: params.href,
            groupId: params.groupId,
            sort: params.sort,
        }, ['name'])
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}${response.req.headers["referer"].indexOf("?") > -1 ? '&' : "?"}success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
}, {
    index: ["/api/admin/updateBookmark"],
    service: async  params => {
        return bookmarkDb.updateItem({
            id: params.id,
            name: params.name,
            icon: params.uploads.icon,
            href: params.href,
            sort: params.sort,
            groupId: params.groupId,
        })
    },
    send: (response, params, result, config) => {
        // console.log(response.req)
        response.writeHead(301, {'Location': `${response.req.headers["referer"]}${response.req.headers["referer"].indexOf("?") > -1 ? '&' : "?"}success=${result.success}&message=${urlencode.encode(result.message, 'utf-8')}`});
        return response.end()
    }
}, {
    index: ['/api/admin/deleteBookmark'],
    service: async  params => {
        return bookmarkDb.deleteItem({
            id: params.id,
        })
    },
    send: (response, params, result, config) => {
        return response.endJson(result)

    }
}]
