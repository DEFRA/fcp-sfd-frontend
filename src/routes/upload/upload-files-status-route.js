const uploadStatusRoute = {
  method: 'GET',
  path: '/upload-status',
  handler: async (request, h) => {
    // WIP - this page needs the uploadId to query teh status of the upload.
    // how can we get the uploadId? Do we need to store it in the session cache.
    const uploadId = ''
    const response = await fetch(`http://cdp-uploader:7337/status/${uploadId}`)
    const body = await response.json()

    const fileStatus = body // get this from the response body and format it

    // GET from the cdp uploader
    // play back the status on this page

    // this page also needs to support an ADDITIONAL upload.
    // how do we consolidate this on this page to show success of a second upload which would have a new uploadId etc for backend but to a user appears as one more upload.
    return h.view('upload/upload-status.njk', { fileStatus })
  }
}

export const uploadStatusRoutes = [
  uploadStatusRoute
]
