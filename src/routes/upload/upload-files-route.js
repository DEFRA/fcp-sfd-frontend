// everything we need to populate the page
// where can we get the sbi etc from if not calling dal/business or personal details?
// pull it out of the DID token?
const pageData = (token, uploadId) => ({
  sbi: token.sbi,
  businessName: token.businessName,
  userName: token.name,
  backLink: '',
  uploadId // get from the response to cdp
})

const uploadFilesRoute = {
  method: 'GET',
  path: '/upload',
  handler: async (request, h) => {
    // need to have all the metadata at this point
    // get the uploadID etc from /initiate
    // return the view with the uploadID passed into this view
    const defraIdToken = await request.server.app.cache.get(request.auth.credentials.sessionId) // this will be used frequently so own module/ might be already done in Fay's ticket

    const metadata = {
      sbi: defraIdToken.sbi,
      crn: defraIdToken.crn,
      reference: 'this was sent from the frontend service'
    }

    const uploaderPayload = {
      redirect: 'http://localhost:3000/home',
      callback: 'http://fcp-sfd-object-processor-development:3004/api/v1/callback',
      s3Bucket: 'fcp-sfd-object-processor-bucket',
      s3Path: 'scanned',
      metadata
    }

    // initiate the upload with cdp uploader, sending the metadata now
    const response = await fetch('http://cdp-uploader:7337/initiate', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(uploaderPayload)
    })

    const body = await response.json()
    const { uploadId } = body
    console.log(uploadId)

    // pull out the uploadId and pass it to the view so we can use it as part of the form
    return h.view('upload/upload.njk', pageData(defraIdToken, uploadId))
  }
}

// Sets form action to go direct to CDP uploader
// redirect to the page with status etc

export const uploadFilesRoutes = [
  uploadFilesRoute
]
