import { getIOInstance } from '~/server/plugins/socket.io'
export default defineEventHandler(event => {
	const io = getIOInstance();
	
	io.emit('announcement', 'Hello all!');

	return {
		message: 'Announcement success!'
	}
})
