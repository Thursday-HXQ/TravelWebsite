var blogDetail = new Vue({
    el:'#blogDetail',
    data:{
        detail:{},
        newBlog:[],
        hotBlog:[],
        commentList: [],
        commentTotal: 0,
        page: 1,
        pageSize: 10,
        pageNumList: [],
        parentId: 0,
        parentUserName: "",
        commentText:'',

    },
    created(){
        if(location.search && location.search.split("=")[1]){
            this.getData();
            this.getComment();
        }else{
            window.location.href="http://localhost:8088/error.html"
        }
    },
    methods:{
        getData(){
            axios.get('/queryBlogById?id='+location.search.split("=")[1]).then(res=>{
                this.detail = res.data.data[0];
                console.log(this.detail)
            }).catch(res=>{

            });
            axios.get('/queryHotBlog').then(res=>{
                console.log(res)
                this.hotBlog = res.data.data
            })
            axios.get('/queryNewBlog').then(res=>{
                console.log(res)
                this.newBlog = res.data.data
            })
        },
        imeFormatter(value) {
            var da = new Date(
                value
                    .replace("/Date(", "")
                    .replace(")/", "")
                    .split("+")[0]
            );
            return (
                da.getFullYear() +
                "-" +
                (da.getMonth() + 1 < 10
                    ? "0" + (da.getMonth() + 1)
                    : da.getMonth() + 1) +
                "-" +
                (da.getDate() < 10 ? "0" + da.getDate() : da.getDate()) +
                " " +
                (da.getHours() < 10 ? "0" + da.getHours() : da.getHours()) +
                ":" +
                (da.getMinutes() < 10 ? "0" + da.getMinutes() : da.getMinutes()) +
                ":" +
                (da.getSeconds() < 10 ? "0" + da.getSeconds() : da.getSeconds())
            );
        },
        getComment() {
            let root = this;
            axios.get('/getCommentByBlogId?blogId=' + window.location.search.split("=")[1] + '&page=' + (this.page - 1) + "&pageSize=" + this.pageSize)
                .then(res => {
                    console.log(res)
                    // this.commentList = res.data.data;
                    let data = res.data.data;
                    root.commentTotal = data.count;
                    let size = Math.ceil(root.commentTotal / root.pageSize);
                    root.pageNumList = [];
                    for (var i = 0; i < size; i++) {
                        root.pageNumList.push(i + 1);
                    }
                    root.commentList = data.commentList;
                }).catch(res => {

                })
        },
        addComment(bId) {
            console.log(bId)
            if (!this.commentText) {
                alert("评论不能为空")
                return
            } else if (!bId) {
                alert("评论失败！")
                return
            } else {
                if (!window.sessionStorage.getItem('userId')) {
                    alert('请先登录！')
                    return;
                }
                let blogId = bId;
                let uId = window.sessionStorage.getItem('userId');
                let text = this.commentText;
                let pId = this.parentId;
                // console.log(pun)
                // console.log(pic)
                axios.post('/addBlogComment', {
                    text,
                    uId,
                    bId,
                    // username,
                    // pic,
                    pId,
                    // parentusername: pun
                }).then(res => {
                    alert("评论成功！");
                    // this.getComment();
                    history.go(0);
                }).catch(res => {
                    alert("评论失败！")
                })
            }
        },
        reply(cId, username) {
            console.log(cId, username)
            this.parentId = cId;
            this.parentUserName = username;
            // this.addComment(this.hId);
        }
    }
})