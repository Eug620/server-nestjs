window.onload = function () {
    var searchParams = new URLSearchParams(location.search);
    const username = searchParams.get('username')
    const password = searchParams.get('password')
    const email = searchParams.get('email')
    const baseUrl = 'http://192.168.58.190:3000'
    const socketUrl = 'ws://192.168.58.190:3001'
    // 1. 登录用户
    const loginBtn = document.getElementById('login-btn')
    loginBtn.addEventListener('click', function () {
        fetch(baseUrl + '/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then(res => res.json())
            .then(({ data }) => {

                console.log(data)
                const token = `${data.token_type} ${data.access_token}`
                // 3. 存储 Token（例如，在 localStorage 中）
                localStorage.setItem('access_token', token);
            })

    })
    // 2. 注册用户
    const registerBtn = document.getElementById('register-btn')
    registerBtn.addEventListener('click', function () {
        fetch(baseUrl + '/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                email,
            }),
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })
    // 3. 连接 WebSocket 服务器
    const connectBtn = document.getElementById('connect-btn')
    connectBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        const socket = io(socketUrl, {
            path: '/websocket',
            transports: ['websocket'],
            auth: {
                token,
            },
        });
        socket.on('connect', () => {
            console.log('WebSocket connected');
            // 6. 发送消息到服务器
            socket.emit('message', { message: 'Hello, WebSocket!' });
            socket.emit('init');
        });
        socket.on('message', (event) => {
            console.log('Message from server:', event);
        });
        socket.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        socket.on('disconnect', () => {
            console.log('WebSocket closed');
        });
        socket.on('exception', (error) => {
            console.log('WebSocket exception:', error);
            socket.disconnect();
        });

    })
    // 4. 获取用户列表
    const getUserListBtn = document.getElementById('get-user-list-btn')
    getUserListBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        fetch(baseUrl + '/user', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })
    // 5. 获取房间列表
    const getRoomListBtn = document.getElementById('get-room-list-btn')
    getRoomListBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        fetch(baseUrl + '/room', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })
    // 6. 获取我的房间列表
    const getMyRoomListBtn = document.getElementById('get-my-room-list-btn')
    getMyRoomListBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        fetch(baseUrl + '/room/mine', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })
    // 7. 创建房间
    const createBtn = document.getElementById('create')
    createBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        const name = document.getElementById('name').value
        const description = document.getElementById('description').value
        fetch(baseUrl + '/room', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

                'Authorization': token,
            },
            body: JSON.stringify({
                name,
                description,
            }),
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })
    // 8. 加入房间
    const joinBtn = document.getElementById('join')
    joinBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        const room_id = document.getElementById('roomId').value
        fetch(baseUrl + '/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({
                room_id,
            }),
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })
    // 9. 申请好友
    const applyBtn = document.getElementById('apply')
    applyBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        const apply_user_id = document.getElementById('applyUserId').value
        fetch(baseUrl + '/apply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
            body: JSON.stringify({
                apply_user_id,
            }),
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })
    // 10. 获取申请列表
    const applyListBtn = document.getElementById('applyList')
    applyListBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        fetch(baseUrl + '/apply', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
                const applyList = document.querySelector('.apply-list')
                applyList.innerHTML = ''
                data.forEach(item => {
                    applyList.innerHTML += `
                            <div style="margin-bottom: 10px; border: 1px solid #ccc; padding: 5px;">
                                ${item.user_info.username} <br> 
                                ${item.createdAt} <br> 
                                ${item.room_id ? '申请加入房间' : '申请好友'} <br> 
                                ${item.room_info?.name || item.apply_user_info?.username} <br> 
                                ${item.status ? '已通过' : '未通过'} <br> 
                                ${item.handle_status ? '已处理' : '未处理'}<br> 


                                <button onclick="${handleApply}('${item.id}', ${true})" id="accept-btn-${item.id}">通过</button>
                                <button onclick="${handleApply}('${item.id}', ${false})" id="reject-btn-${item.id}">拒绝</button>
                            </div>
                        `
                })

                // 10. 处理申请
                function handleApply(applyId, status) {
                    // 9. 处理申请
                    fetch(baseUrl + `/apply/${applyId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('access_token'),
                        },
                        body: JSON.stringify({
                            status,
                        }),
                    })
                        .then(res => res.json())
                        .then(({ data }) => {
                            console.log(data)
                        })
                }

            })



    })

    // 11. 获取好友列表
    const friendListBtn = document.getElementById('friendList')
    friendListBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        fetch(baseUrl + '/friend', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token,
            },
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
            })
    })

    // 12. 获取房间申请列表
    const applyRoomListBtn = document.getElementById('applyRoomList')
    applyRoomListBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        fetch(baseUrl + '/apply/room', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(res => res.json())
            .then(({ data }) => {
                console.log(data)
                // 4. 渲染房间申请列表到页面
                const applyRoomList = document.querySelector('.apply-room-list')
                applyRoomList.innerHTML = data.map(item => `
                    <div class="apply-room-item" style="margin-bottom: 10px; border: 1px solid #ccc; padding: 10px;">
                        <div class="apply-friend-item-info">
                            <div class="apply-friend-item-info-name">${item.user_info.username}</div>
                            <div class="apply-friend-item-info-desc">${item.user_info.email}</div>
                        </div>
                        <div class="apply-room-item-info">
                            <div class="apply-room-item-info-name">${item.room_info.name}</div>
                            <div class="apply-room-item-info-desc">${item.room_info.description}</div>
                        </div>
                        <div class="apply-room-item-actions">
                            <button class="apply-room-item-actions-accept" data-room-id="${item.id}">同意</button>
                            <button class="apply-room-item-actions-reject" data-room-id="${item.id}">拒绝</button>
                        </div>
                    </div>
                `).join('')
                // 5. 为同意和拒绝按钮添加点击事件
                applyRoomList.querySelectorAll('.apply-room-item-actions-accept').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const roomId = e.target.dataset.roomId
                        acceptApplyRoom(roomId)
                    })
                })
                applyRoomList.querySelectorAll('.apply-room-item-actions-reject').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const roomId = e.target.dataset.roomId
                        rejectApplyRoom(roomId)
                    })
                })

                // 6. 处理同意房间申请
                function acceptApplyRoom(roomId) {
                    fetch(baseUrl + `/apply/${roomId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('access_token'),
                        },
                        body: JSON.stringify({
                            status: true,
                        }),
                    }).then(res => res.json()).then(({ data }) => {
                        console.log(data)
                        // 6. 刷新房间申请列表
                        getApplyRoomList()
                    })
                }
                // 7. 处理拒绝房间申请
                function rejectApplyRoom(roomId) {
                    fetch(baseUrl + `/apply/${roomId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('access_token'),
                        },
                        body: JSON.stringify({
                            status: false,
                        }),
                    }).then(res => res.json()).then(({ data }) => {
                        console.log(data)
                        // 6. 刷新房间申请列表
                        getApplyRoomList()
                    })
                }

            })
    })

    // 13. 获取好友申请列表
    const applyFriendListBtn = document.getElementById('applyFriendList')
    applyFriendListBtn.addEventListener('click', function () {
        const token = localStorage.getItem('access_token')
        if (!token) {
            alert('请先登录')
            return
        }
        fetch(baseUrl + '/apply/mine', {
            method: 'GET',
            headers: {
                'Authorization': token,
            },
        })
            .then(res => res.json())
            .then(({ data }) => {
                // 4. 渲染好友申请列表到页面
                const applyFriendList = document.querySelector('.apply-friend-list')
                applyFriendList.innerHTML = data.map(item => `
                    <div class="apply-friend-item"  style="margin-bottom: 10px; border: 1px solid #ccc; padding: 10px;">
                        <div class="apply-friend-item-info">
                            <div class="apply-friend-item-info-name">${item.user_info.username}</div>
                            <div class="apply-friend-item-info-desc">${item.user_info.email}</div>
                        </div>
                        <div class="apply-friend-item-info">
                            <div class="apply-friend-item-info-name">${item.apply_user_info.username}</div>
                            <div class="apply-friend-item-info-desc">${item.apply_user_info.email}</div>
                        </div>
                        <div class="apply-friend-item-actions">
                            <button class="apply-friend-item-actions-accept" data-friend-id="${item.id}">同意</button>
                            <button class="apply-friend-item-actions-reject" data-friend-id="${item.id}">拒绝</button>
                        </div>
                    </div>
                `).join('')
                // 5. 为同意和拒绝按钮添加点击事件
                applyFriendList.querySelectorAll('.apply-friend-item-actions-accept').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const friendId = e.target.dataset.friendId
                        acceptApplyFriend(friendId)
                    })
                })
                applyFriendList.querySelectorAll('.apply-friend-item-actions-reject').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const friendId = e.target.dataset.friendId
                        rejectApplyFriend(friendId)
                    })
                })
                // 6. 处理同意好友申请
                function acceptApplyFriend(friendId) {
                    fetch(baseUrl + `/apply/${friendId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('access_token'),
                        },
                        body: JSON.stringify({
                            status: true,
                        }),
                    }).then(res => res.json()).then(({ data }) => {
                        console.log(data)
                        // 6. 刷新好友申请列表
                        getApplyFriendList()
                    })
                }
                // 7. 处理拒绝好友申请
                function rejectApplyFriend(friendId) {
                    fetch(baseUrl + `/apply/${friendId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('access_token'),
                        },
                        body: JSON.stringify({
                            status: false,
                        }),
                    }).then(res => res.json()).then(({ data }) => {
                        console.log(data)
                        // 6. 刷新好友申请列表

                        getApplyFriendList()
                    })
                }

            })
    })
}