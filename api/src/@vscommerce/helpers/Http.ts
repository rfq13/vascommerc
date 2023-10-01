import https from 'https'
import QueryString from 'qs'
import Url from 'url'

export const hPost = (
  url: string,
  body: any,
  headers: object,
  port: number = 443
) => {
  // Build the post string from an object
  var post_data = JSON.stringify(body)

  // get url and path from url using url module
  var parsedUrl = Url.parse(url)

  // An object of options to indicate where to post to
  var post_options = {
    host: parsedUrl.hostname,
    port: port,
    path: parsedUrl.path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data),
      ...headers,
    },
  }

  console.log('post_options', post_options, { post_data })

  return new Promise((resolve, reject) => {
    // Set up the request
    var post_req = https.request(post_options, function (res) {
      res.setEncoding('utf8')
      let data = ''
      res.on('data', function (chunk) {
        data += chunk
      })
      res.on('end', function () {
        resolve(JSON.parse(data))
      })
    })

    // post the data
    post_req.write(post_data)
    post_req.end()
  })
}
