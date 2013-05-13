lyric = document.createElement("div") ;
lyric_url = '' ;
song_name = '' ;
artist_name = '' ;

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
			
			script = document.createElement('script');
			script.type = 'text/javascript';
			script.innerHTML = "$('body').attr('artist', FM.getCurrentSongInfo().artistName);";
			document.head.appendChild(script);
			document.head.removeChild(script);
			artist_name = $('body').attr('artist');
					
			lyric_url = '' ;
			get_url = false ;
			song_name = new_song_name ;
			getLyric() ;
		}
	}
}) ;

function getLyric()
{
	$.get('http://translate.google.com.tw/translate_a/t?client=t&hl=zh-TW&sl=zh-CN&tl=zh-TW&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&ssel=3&tsel=3&sc=1&q=' + song_name + ' ; ' + artist_name , function(data){
		
		translate_name = data.split('[[["')[1].split('"')[0].split(' ; ') ;
		
		song = translate_name[0].toLowerCase().replace(' ' , '') ;
		artist = translate_name[1].toLowerCase() ;
		
		console.log(song) ;
		console.log(artist) ;
		
		$.get('http://mojim.com/' + song + '.html?t3' , function(data){
			$.each(data.split('<td Class="iA"><a Href="') , function(index , value) {
				if (index != 0)
				{
					data = value.toLowerCase() ;
					
					if (data.search(song) > 0 && data.search(artist) > 0 && data.search('歌詞') > 0)
					{
						console.log("in : " + data) ;
						url = data.split('" title="')[0] ;
						if (url.split('x').length == 3 && url.substring(url.length - 3 , url.length) == 'htm')
						{
							console.log(url) ;
							lyric_url = url ;
							get_url = true ;
							return false ;
						}
					}
				}
				
				if (get_url)
					return false ;
			}) ;
			
			if (!get_url)
				$('#lyric_div').append('Sorry , 404 ...') ;
			else
			{
				$.get('http://mojim.com' + lyric_url , function(data){
					console.log(lyric_url) ;
					$('#lyric_div').append(data.split('</dt><dd><br />')[1].split('</dl>')[0]) ;
				}) ;
			}
		}) ;
		
	}) ;
}