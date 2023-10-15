export const successResponse = (results: any = null, others: object = {}) => {
  const object = {
    ok: true,
    results,
    ...others
  }
	console.log('\n[Response]:', JSON.stringify(object))
	return object;
}