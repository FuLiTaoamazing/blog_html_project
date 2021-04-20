layui.use(['element', 'jquery', 'form', 'layedit', 'flow', 'layer'], function() {
	var element = layui.element;
	var $ = layui.jquery;
	var layer = layui.layer;
	$(document).ready(function() {
		//index页面初始化的方法
		$.ajax({
			url: "http://212.64.70.240:8080/article/index",
			type: "GET",
			dataType: 'json',
			async: false,
			success: function(result) {
				$('#LAY_bloglist').append('');
				for (var i = 0; i < result.data.blogs.length; i++) {
					createBlog(result.data.blogs[i]);
				}
				for (var i = 0; i < result.data.tagList.length; i++) {
					createTags(result.data.tagList[i]);
				}
				for(var i=0;i<result.data.hotList.length;i++){
					createHotList(result.data.hotList[i]);
				}
				for(var i=0;i<result.data.topList.length;i++){
					createTopList(result.data.topList[i]);
				}
			}
		})
// 
// 		PC端通过标签来选择文章
		$("#category li").each(function() {
			$(this).click(function() {
				var indexId = $(this).attr('data-index');
				$('#LAY_bloglist').html('');
				selectBlogByTag(indexId);
			});
		});

	});

	function selectBlogByTag(indexId) {
		$.ajax({
			url: "http://212.64.70.240:80800/article/blogsByTagId?tagId=" + indexId,
			type: "GET",
			dataType: 'json',
			success: function(result) {
				console.info(result)
				$('#LAY_bloglist').append('');
				for (var i = 0; i < result.data.length; i++) {
					createBlog(result.data[i]);
				}
			}
		})
	}


	//创建博客list的方法
	function createBlog(blog) {
		var title = blog.title;
		var id=blog.id;
		var date = blog.date;
		var description = blog.description;
		var views = blog.views;
		var comments = blog.comments;
		var firstPicture = blog.firstPicture;
		var tags = blog.tags;
		var recommentd = blog.recommentd;
		var year = date.substr(0, 4);
		var month = date.substr(5, 2);
		var day = date.substr(8, 2)
		var targs = blog.tags;
		var str = '';
		str += '<section class="article-item zoomIn article">  ';
		if (recommentd) {
			str += '<div class="fc-flag">置顶</div>'
		}
		str += '<h5 class="title"><a href="read.html?id='+id+'">' +title+ '</a></h5>'
		str += '<div class="time">       <span class="day">' + day + '</span>       <span class="month fs-18">' + month +
			'<span class="fs-14">月</span></span>       <span class="year fs-18 ml10">' + year + '</span>   </div> '
		str += '<div class="content">       <a href="read.html?id='+id+'" class="cover img-light">           <img src="' +
			firstPicture + '">       </a>' + description + '   </div>'
		str += '<div class="read-more">       <a href="read.html?id='+id+'" class="fc-black f-fwb">继续阅读</a>   </div> '
		str += '<aside class="f-oh footer">  '
		// 标签 等等循环添加
		str += '<div class="f-fl tags">           <span class="fa fa-tags fs-16"></span>'
		for (var i = 0; i < tags.length; i++) {
			str += '<a class="tag">' + targs[i].tagName + '</a>'
		}
		str += '</div><div class="f-fr">  '
		str += '<span class="read">               <i class="fa fa-eye fs-16"></i>               <i class="num">' + views +
			'</i>           </span>'
		// 评论数等等再弄
		str +=
			'<span class="ml20">               <i class="fa fa-comments fs-16"></i>               <a href="javascript:void(0)" class="num fc-grey">1</a>           </span>       '
		str + '</div>   </aside></section>'
		$('#LAY_bloglist').append(str);
	}
	//创建标签的方法
	function createTags(tag) {
		var tagName = tag.tagName;
		var indexId = tag.id;
		var str = ''
		var phonestr = '';
		str += '<li data-index="' + indexId + '"><a href="#">' + tagName + '</a></li>'
		phonestr += '<a href="#">' + tagName + '</a>'
		$('#category').append(str);
	}

	//创建热门标签的方法
	function createHotList(blog) {
		var blogname = blog.title;
		var id = blog.id;
		var str=''
		str += '<li> <a href="/Blog/Read?id=' + id + '">'+blogname+'</a></li>'
		$('#hot_list').append(str);
	}
	
	//创建置顶推荐文章
	function createTopList(blog){
		var blogname = blog.title;
		var id = blog.id;
		var str=''
		str += '<li> <a href="/Blog/Read?id='+id+'">'+blogname+'</a></li>'
		$('#top_list').append(str);
	}

});
