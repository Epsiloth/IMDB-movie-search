let keyAPI = "cf99591";
		let nPage = 1;
		var course = false;
		var input = "";
		function cambiarIMG(){
			$("img").on("error", function(){
				$(this).attr("src", "https://www.computerhope.com/jargon/////e/error.gif")
			})
		}

		function ajaxPetition(input){
			if(!course){
				course = true;
				$.ajax({url: "https://www.omdbapi.com/?s="+input+"&apikey="+keyAPI+"&page="+nPage, beforeSend: function(){
					let spinner = $('<div class="spinner-border text-warning" id="spinner"></div>');
					$('#container').append(spinner);
				},
				complete: function(){
					$('#spinner').remove();
				},success: function(result){
					if(result.Search != undefined){
						addData(result.Search);
						nPage += 1;
					}
					course = false;
				}
				});
			}
		}

		function scrollLoad(){
			$(window).scroll(function(){
				if($(window).scrollTop() >= $(document).height() - $(window).height() - 500){
					let posScroll = $(window).scrollTop();
					ajaxPetition(input);
					$(window).scrollTop(posScroll);
				}
			})
		}

		function addData(data){
			for (let i = 0; i < data.length; i++) {
			    let divCard = $('<div class="card border ml-3 mt-5 bg-info text-white" id='+data[i].imdbID+' style="width:20rem"></div>');
			    let imgCard = $('<img class="card-img-top" src='+data[i].Poster+' alt="Card image cap">');
			    let bodyCard = $('<div class="card-body"></div>');
			    let pBody = $('<p class="card-text">'+data[i].Title+" ("+data[i].Year+")" + '</p>');
			    let btn = $('<a class="btn btn-secondary data-toggle="modal" data-target="allInfo">Details</a>');

			    divCard.append(imgCard);
			    bodyCard.append(pBody);
			    divCard.append(bodyCard);
			    divCard.append(btn);

			    $('#container').append(divCard);
			    cambiarIMG();

			    btn.click(function(){
			    	let id = divCard.attr("id");
			    	$('#allInfo').remove();
			    	detailPetition(id);
			    });
		  	}
		}

		function detailPetition(id){
			$.ajax({url: "https://www.omdbapi.com/?i="+id+"&apikey="+keyAPI, success: function(result){
					console.log(result);
					detailShow(result);
				}
				});
		}

		function detailShow(result){
			let mdMain = $('<div class="modal fade text-center" id="allInfo" role="dialog"></div>');
			let mdDocument = $('<div class="modal-dialog modal-lg" role="document"></div>');
			let mdContent = $('<div class="modal-content bg-dark text-white"></div>');
			let mdHeader = $('<div class="modal-header"></div>');
			let mdTitle = $('<h5 class="modal-title">'+result.Title+' ('+result.Year+')'+'</h5>');
			let mdBody = $('<div class="modal-body"></div>');
			let mdImage = $('<img src='+result.Poster+'>');
			let mdPlot = $('<p><b>Plot:</b></p><p>'+result.Plot+'</p><hr>');
			let mdRating;
			if(parseFloat(result.imdbRating) < 4){
				console.log("danger");
				mdRating = $('<p><b>Rating:</b></p><div class="progress"><div class="progress-bar bg-danger progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+parseFloat(result.imdbRating)*10+'"aria-valuemin="0" aria-valuemax="100" style="width:'+parseFloat(result.imdbRating)*10+'%">'+parseFloat(result.imdbRating)*10+'%</div></div>');
			}else if(parseFloat(result.imdbRating) >= 4 && parseFloat(result.imdbRating) < 7){
				console.log("warning");
				mdRating = $('<p><b>Rating:</b></p><div class="progress"><div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+parseFloat(result.imdbRating)*10+'"aria-valuemin="0" aria-valuemax="100" style="width:'+parseFloat(result.imdbRating)*10+'%">'+parseFloat(result.imdbRating)*10+'%</div></div>');
			}else if(parseFloat(result.imdbRating) >= 7){
				console.log("success");
				mdRating = $('<p><b>Rating:</b></p><div class="progress"><div class="progress-bar bg-success progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="'+parseFloat(result.imdbRating)*10+'"aria-valuemin="0" aria-valuemax="100" style="width:'+parseFloat(result.imdbRating)*10+'%">'+parseFloat(result.imdbRating)*10+'%</div></div>');
			}
			let mdDetails = $('<p><b>Country:</b> '+result.Country+' <b>Runtime:</b> '+result.Runtime+'</p><hr>');
			let mdDirector = $('<p><b>Director:</b> '+result.Director+'</p><hr>');
			let mdActors = $('<p><b>Actors:</b> '+result.Actors+'</p><hr>');
			let mdGenre = $('<p><b>Genres:</b> '+result.Genre+'</p><hr>');
			let mdFooter = $('<div class="modal-footer"></div>');
			let mdDismiss = $('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>');

			mdHeader.append(mdTitle);

			mdBody.append(mdImage);
			mdBody.append(mdGenre);
			mdBody.append(mdDetails);
			mdBody.append(mdDirector);
			mdBody.append(mdActors);
			mdBody.append(mdPlot);
			mdBody.append(mdRating);

			mdFooter.append(mdDismiss);

			mdContent.append(mdHeader);
			mdContent.append(mdBody);
			mdContent.append(mdFooter);

			mdDocument.append(mdContent);

			mdMain.append(mdDocument);
			mdMain.modal("show");
		}

		$(document).ready(function(){
			scrollLoad();
			$("#search").click(function(){
				$("#container").empty();
				nPage = 1;
				input = $("input").val();
				ajaxPetition(input);
			});
		});
