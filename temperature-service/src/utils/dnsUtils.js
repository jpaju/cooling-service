const dns = require('dns')

/**
 * Returns a Promise that resolves to Fully Qualified Domain Name
 * for specified URL without protocol.
 *
 * e.g http://example/ --> example.int.test.company.com
 *
 * @param {string} url - URL with or without protocol
 */
const getFQDN = (url) => {
    return new Promise((resolve, reject) => {
        // Remove protocol from URL
        const hostname = url.replace(/^.*:\/\//i, '')

        dns.lookup(hostname, (err, addr) => {
            if (err) reject(err)

            dns.reverse(addr, (err, domain) => {
                if (err) reject(err)
                resolve(domain[0])
            })
        })
    })
}


/**
 * Returns a Promise that resolves to Fully Qualified Domain Name
 * for specified URL with protocol.
 *
 * e.g http://example/ --> http://example.int.test.company.com
 *
 * @param {string} url - URL with protocol
 */
const getFQDNUrl = (url) => {
    const PROTOCOL_REGEX = /^.*:\/\//i
    const protocol = url.match(PROTOCOL_REGEX)
    const hostname = url.replace(PROTOCOL_REGEX, '')
    return getFQDN(hostname)
        .then(FQDN => protocol + FQDN)
}


/**
 * Returns a Promise that resolves to Domain Name
 * for specified URL without protocol and hostname.
 *
 * e.g http://example/ --> int.test.company.com
 *
 * @param {string} url - URL with or without protocol
 */
const getDomainName = async (url) => {
    const FQDN = await getFQDN(url)
    return FQDN.replace(/[^.]*./i, '')
}

module.exports = {
    getFQDN,
    getFQDNUrl,
    getDomainName
}