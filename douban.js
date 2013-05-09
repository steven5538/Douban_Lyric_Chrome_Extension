lyric = document.createElement("div") ;
lyric_url = '' ;
song_name = '' ;

get_url = false ;

lyric.id = "lyric_div" ;
$(lyric).css({
	'border':'1px soild' ,
	'width':'525px' ,
	'height':'150px' ,
	'zIndex':'999' ,
	'position':'absolute' ,
	'left':'47%' ,
	'top':'50%' ,
	'overflow-y':'auto'
}) ;
$('body').append(lyric) ;

song_name = $('title').html().split(' - ')[0] ;

$('title').timer({
	delay: 5000 ,
	repeat: true ,
	callback: function(index) {
		new_song_name = $('title').html().split(' - ')[0] ;
		if (song_name != new_song_name)
		{
			$('#lyric_div').empty() ;
			lyric_url = '' ;
			get_url = false ;
			song_name = new_song_name ;
			getLyric() ;
		}
	}
}) ;

function getLyric()
{
	$.get('http://translate.google.com.tw/translate_a/t?client=t&hl=zh-TW&sl=zh-CN&tl=zh-TW&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&ssel=3&tsel=3&sc=1&q=' + song_name , function(data){
		
		translate_name = data.split('[[["')[1].split('"')[0] ;
		
		console.log(translate_name) ;
		
		$.get('http://mojim.com/' + translate_name + '.html?t3' , function(data){
			$.each(data.split('<td Class="iA"><a Href="') , function(index , value) {
				if (index != 0)
				{
					$.each(data.split('<td Class="iA"><a Href="')[index].split('" Title="') , function(index , value) {
						if (index == 0)
						{
							if (value.split('x').length == 3)
							{
									lyric_url = value ;
									get_url = true ;
									return false ;
							}
						}
					}) ;
				}
				
				if (get_url)
					return false ;
			}) ;
			
			$.get('http://mojim.com' + lyric_url , function(data){
				console.log(lyric_url) ;
				$('#lyric_div').append(data.split('</dt><dd><br />')[1].split('</dl>')[0]) ;
			}) ;
		}) ;
		
	}) ;
}