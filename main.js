	var data = {
		format: "Standard",
		coins: new Decimal(100),
		coinupgrades: new Decimal(0),
		metaBonus: new Decimal(1),
		coinmulti: new Decimal(1),
		tiers: [
			{ Name: "Nanoprestige", RequirementString: " Coins", Cost: new Decimal(10), Prestiges: new Decimal(1) },
			{ Name: "Microprestige", RequirementString: "x Tier I", Cost: new Decimal(2), Prestiges: new Decimal(0) },
			{ Name: "Miniprestige", RequirementString: "x Tier II", Cost: new Decimal(3), Prestiges: new Decimal(0) }, 
			{ Name: "Small Prestige", RequirementString: "x Tier III", Cost: new Decimal(4), Prestiges: new Decimal(0) },
			{ Name: "Partial Prestige", RequirementString: "x Tier IV", Cost: new Decimal(5), Prestiges: new Decimal(0) },
			{ Name: "Full Prestige", RequirementString: "x Tier V", Cost: new Decimal(6), Prestiges: new Decimal(0) },
			{ Name: "Multiprestige", RequirementString: "x Tier VI", Cost: new Decimal(7), Prestiges: new Decimal(0) },
			{ Name: "Hyperprestige", RequirementString: "x Tier VII", Cost: new Decimal(8), Prestiges: new Decimal(0) },
			{ Name: "Ultraprestige", RequirementString: "x Tier VIII", Cost: new Decimal(9), Prestiges: new Decimal(0) },
			{ Name: "Final Prestige", RequirementString: "x Tier IX", Cost: new Decimal(10), Prestiges: new Decimal(0) }],
		unlocks: 
			{ 
				tiers: [true, false, false, false, false, false, false, false, false],
				autoCoinupgrade: false,
				prestigeBoosts: false
			},
		tierBoosts: [new Decimal(0),new Decimal(0),
			new Decimal(0),new Decimal(0),
			new Decimal(0),new Decimal(0),
			new Decimal(0),new Decimal(0),
			new Decimal(0),new Decimal(0)]
	};

	function getGain() {
		var gain = new Decimal(1);
		for(var i=0; i<10; i++)
		{
			var x = data.tiers[i].Prestiges;
			if(x.greaterThan(new Decimal(0)))
				gain = gain.times(x.times(i+1));
		}
		return gain.times(data.coinmulti);
	}

	function getCoinUpgradePrice() {
			return Decimal.pow(1.5,data.coinupgrades).times(10).floor();
	}

	function getRequirement(id) {
			if(id === 0)
				return data.tiers[id].Cost;
			else
				return Decimal.pow(id+1,(data.tiers[id].Prestiges.add(1)));
	}

	function canActivatePrestige(id) {
		if (id===0) {
			return (data.coins.greaterThanOrEqualTo(data.tiers[id].Cost));
		} else {
			return (data.tiers[id-1].Prestiges.greaterThanOrEqualTo(getRequirement(id)));
		}
	}

	function activatePrestige(id) {
			data.coins = new Decimal(0);
			data.coinupgrades = new Decimal(0);
			data.coinmulti = new Decimal(1);
			if(id === 0)
			{
				data.tiers[id].Cost = data.tiers[id].Cost.times(2);
				data.tiers[id].Prestiges = data.tiers[id].Prestiges.add(1);
				data.unlocks.tiers[id] = true;
				document.getElementById("tierunlock" + (id+1)).style.display = "table-row";
				return;
			}

			for (var i = 0; i < id; i++) {
				
				data.tiers[i].Prestiges = new Decimal(0);

				if(i === 0)
					data.tiers[i].Prestiges = new Decimal(1);

				data.tiers[i].Cost = new Decimal(i+1);
			}
			data.tiers[0].Cost = new Decimal(20);

			data.tiers[id].Prestiges = data.tiers[id].Prestiges.add(1);
			data.tiers[id].Cost = data.tiers[id].Cost.times(id+1);
			if(data.tiers[id].Prestiges.equals(data.tiers[id+1].Cost) && id != 9)
			{
				data.unlocks.tiers[id] = true;
				document.getElementById("tierunlock" + (id+1)).style.display = "table-row";
			}
		draw();
	}

	function update() {
		//scale the gain by the actual number of seconds since the last update
		const curTime = (new Date()).getTime();
		const deltaTime = (data.lastTime === undefined) ? 1 : ((curTime - data.lastTime) / 1000);
		data.lastTime = curTime;
		data.coins = data.coins.add(getGain() * deltaTime);
		checkUnlocks();
		if(/*data.unlocks.autoCoinupgrade === true*/document.getElementById("autoUpgradeCB").checked === true && getCoinUpgradePrice().lessThan(getRequirement(0)))
			upgradeCoins();
		// localStorage.NOTSOSHITPOST = JSON.stringify(data);
	}

	function checkUnlocks() {
		// var x = new Decimal("1e+4");
		if(data.coins.greaterThanOrEqualTo(new Decimal("1e+4")) || data.unlocks.autoCoinupgrade === true)
		{
			document.getElementById("autoUpgradeCoins").style.display = "inline";
			data.unlocks.autoCoinupgrade = true;
		}
		if(data.coins.greaterThanOrEqualTo(new Decimal("1e+6")) || data.unlocks.prestigeBoosts === true)
		{
			data.unlocks.prestigeBoosts = true;
			document.getElementsByClassName("prestigeBoostColumn").style.display = "table-cell";
		}
	}

	function draw()
	{
		document.getElementById("coins").textContent = format(data.coins, data.format);
		document.getElementById("gain").textContent = format(getGain(), data.format);
		document.getElementById("upgradebtn").textContent = format(getCoinUpgradePrice(), data.format) + " Coins";
		data.tiers.forEach(function (el, i) {
			document.getElementById("tier"+(i+1)+"btn").textContent = format(data.tiers[i].Cost, data.format) + data.tiers[i].RequirementString;
			document.getElementById("tier"+(i+1)+"a").textContent = format(el.Prestiges, data.format);
			document.getElementById("tier"+(i+1)+"mul").textContent = "x" + format((el.Prestiges.times(1+i)), data.format);
			if (canActivatePrestige(i)) {
				document.getElementById("tier"+(i+1)+"btn").disabled = false;
			} else {
				document.getElementById("tier"+(i+1)+"btn").disabled = true;
			}
			if(data.coins.greaterThanOrEqualTo(getCoinUpgradePrice()))
				document.getElementById("upgradebtn").disabled = false;
			else
				document.getElementById("upgradebtn").disabled = true;
		});
	}

	function upgradeCoins()
	{
			if(data.coins.greaterThanOrEqualTo(getCoinUpgradePrice())) {
				data.coins = data.coins.sub(getCoinUpgradePrice());
				data.coinupgrades = data.coinupgrades.add(1);
				data.coinmulti = data.coinmulti.add(1);
			}
	}

	window.addEventListener("load",function () {
		// if (localStorage.SHITPOST) {
		// 	tempdata = JSON.parse(localStorage.SHITPOST);
		// 	tempdata.format = "Engineering";
		// 	tempdata.coins = new Decimal(0);
		// 	tempdata.coinupgrades = new Decimal(tempdata.coinupgrades);
		// 	tempdata.coinmulti = new Decimal(tempdata.coinmulti);
		// 	tempdata.metaBonus = new Decimal(tempdata.metaBonus);
		// 	for(var i=0; i<10;i++)
		// 	{
		// 		tempdata.tiers[i].Prestiges = new Decimal(tempdata.tiers[i].Prestiges);
		// 		tempdata.tiers[i].Cost = new Decimal(tempdata.tiers[i].Cost);
		// 	}
		// 	data = tempdata;
		// 	localStorage.SHITPOST = JSON.stringify(data);
		// }
		// if (localStorage.META) {
		// 	data.metaBonus = JSON.parse(localStorage.META).multiForOthers;
		// }
		draw();
		for (var i = 0; i < 10; i++) {
			document.getElementById("tier"+(i+1)+"btn").addEventListener(
				"click",
				(function(n) {
					return (function () {
						activatePrestige(n);
					});
				}(i))
			);
		}
		document.getElementById("upgradebtn").addEventListener(
				"click",
				upgradeCoins
			);
		
		setInterval(function () {
			update();
			draw();
		}, 100);
		console.log("interval loaded");
	});
