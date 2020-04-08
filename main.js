	var data = {
		format: "Standard",
		totalCoins: new Decimal(1),
		coins: new Decimal(1),
		coinupgrades: new Decimal(0),
		metaBonus: new Decimal(1),
		coinmulti: new Decimal(1),
		tiers: [
			{ Name: "Nanoprestige", RequirementString: " Coins", Cost: new Decimal(10), Prestiges: new Decimal(1), Multi: new Decimal(1) },
			{ Name: "Microprestige", RequirementString: "x Tier I", Cost: new Decimal(2), Prestiges: new Decimal(0), Multi: new Decimal(1) },
			{ Name: "Miniprestige", RequirementString: "x Tier II", Cost: new Decimal(3), Prestiges: new Decimal(0), Multi: new Decimal(1) }, 
			{ Name: "Small Prestige", RequirementString: "x Tier III", Cost: new Decimal(4), Prestiges: new Decimal(0), Multi: new Decimal(1) },
			{ Name: "Partial Prestige", RequirementString: "x Tier IV", Cost: new Decimal(5), Prestiges: new Decimal(0), Multi: new Decimal(1) },
			{ Name: "Full Prestige", RequirementString: "x Tier V", Cost: new Decimal(6), Prestiges: new Decimal(0), Multi: new Decimal(1) },
			{ Name: "Multiprestige", RequirementString: "x Tier VI", Cost: new Decimal(7), Prestiges: new Decimal(0), Multi: new Decimal(1) },
			{ Name: "Hyperprestige", RequirementString: "x Tier VII", Cost: new Decimal(8), Prestiges: new Decimal(0), Multi: new Decimal(1) },
			{ Name: "Ultraprestige", RequirementString: "x Tier VIII", Cost: new Decimal(9), Prestiges: new Decimal(0), Multi: new Decimal(1) },
			{ Name: "Final Prestige", RequirementString: "x Tier IX", Cost: new Decimal(10), Prestiges: new Decimal(0), Multi: new Decimal(1) }],
		unlocks: 
			{ 
				tiers: [true, false, false, false, false, false, false, false, false],
				autoCoinupgrade: false,
				prestigeBoosts: false
			},
		tierBoosts:
		{	boosts: [
				new Decimal(0),new Decimal(0),
				new Decimal(0),new Decimal(0),
				new Decimal(0),new Decimal(0),
				new Decimal(0),new Decimal(0),
				new Decimal(0),new Decimal(0)],
			boostsCost: [
				new Decimal("1e+8"),new Decimal("1e+9"),
				new Decimal("1e+10"),new Decimal("1e+11"),
				new Decimal("1e+12"),new Decimal("1e+13"),
				new Decimal("1e+14"),new Decimal("1e+15"),
				new Decimal("1e+16"),new Decimal("1e+17")]
		},
		autobuy: [false,false,false,false,false,false,false,false,false,false]
	};

	function getGain() {
		var gain = new Decimal(1);
		for(var i=0; i<10; i++)
		{
			var x = data.tiers[i].Prestiges;
			if(x.greaterThan(new Decimal(0)))
				gain = gain.times(x.times(i+1).times(data.tiers[i].Multi));
		}
		return gain.times(data.coinmulti).times(data.metaBonus);
	}

	function getTierBoostPrice(id)
	{
		return data.tierBoosts.boostsCost[id];
	}

	function getCoinUpgradePrice() {
			return Decimal.pow(2,data.coinupgrades).times(10).floor();
	}

	function getRequirement(id) {
			if(id === 0)
				return data.tiers[id].Cost;
			else
				return data.tiers[id].Cost;
				// return Decimal.pow(id+1,(data.tiers[id].Prestiges.add(1)));
	}

	function getMetaPrestigePoints()
	{
		return data.totalCoins.dividedBy(new Decimal("1e+10")).floor();
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
				data.tiers[id].Cost = data.tiers[id].Cost.times(1.5);
				data.tiers[id].Prestiges = data.tiers[id].Prestiges.add(1);
				data.unlocks.tiers[id] = true;
				document.getElementById("tierunlock" + (id+1)).style.display = "table-row";
				if(data.tiers[id].Prestiges.greaterThanOrEqualTo(10))
					data.autobuy[id] = true;
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
			
			if(data.tiers[id].Prestiges.greaterThanOrEqualTo(10))
				data.autobuy[id] = true;

			data.tiers[id].Cost = data.tiers[id].Cost.add(id+1);
			if(data.tiers[id].Prestiges.equals(data.tiers[id+1].Cost) && id != 9)
			{
				data.unlocks.tiers[id] = true;
				document.getElementById("tierunlock" + (id+1)).style.display = "table-row";
			}
		draw();
	}

	function activateMetaprestige()
	{
		if(getMetaPrestigePoints().add(data.metaBonus).greaterThan(data.metaBonus)) {
			data.metaBonus = getMetaPrestigePoints().add(data.metaBonus);

			data.coins = new Decimal(0);
			// data.totalCoins = new Decimal(0);
			data.coinupgrades = new Decimal(0);
			data.coinmulti = new Decimal(1);

			for (var i = 0; i < 10; i++) {
				data.tiers[i].Prestiges = new Decimal(0);
				data.tiers[i].Multi = new Decimal(1);

				if(i === 0)
					data.tiers[i].Prestiges = new Decimal(1);

				data.tiers[i].Cost = new Decimal(i+1);
				data.tierBoosts.boosts[i] = new Decimal(0);
				data.tierBoosts.boostsCost[i] = new Decimal("1e+6").times(new Decimal(10).pow(i));
			}
			data.tiers[0].Cost = new Decimal(20);
		}
	}

	function update() {
		const curTime = (new Date()).getTime();
		const deltaTime = (data.lastTime === undefined) ? 1 : ((curTime - data.lastTime) / 1000);
		data.lastTime = curTime;
		var tick = getGain();
		data.coins = data.coins.add(tick * deltaTime);
		data.totalCoins = data.totalCoins.add(tick * deltaTime);
		checkUnlocks();
		if(document.getElementById("autoUpgradeCB").checked === true && getCoinUpgradePrice().lessThan(getRequirement(0)))
			upgradeCoins();
		for(var i = 9; i >= 0; i--)
		{
			if(data.autobuy[i] === true && canActivatePrestige(i))
				activatePrestige(i);
		}
		localStorage.UltimatePrestigeSave = JSON.stringify(data);
	}

	function checkUnlocks() {
		if(data.totalCoins.greaterThanOrEqualTo(new Decimal("1e+4")) || data.unlocks.autoCoinupgrade === true)
		{
			document.getElementById("autoUpgradeCoins").style.display = "inline";
			data.unlocks.autoCoinupgrade = true;
		}
		if(data.coins.greaterThanOrEqualTo(new Decimal("1e+8")) || data.unlocks.prestigeBoosts === true)
		{
			data.unlocks.prestigeBoosts = true;
			var x = document.getElementsByClassName("prestigeBoostColumn");
			for(var i = 0; i < x.length; i++)
			{
				x[i].style.display = "table-cell";
			};
		}
		if(data.totalCoins.greaterThanOrEqualTo(new Decimal("1e+10")) || data.metaBonus.greaterThan(new Decimal(1)))
			document.getElementById("metaPrestigeDiv").style.display = "block";
	}

	function draw()
	{
		document.getElementById("coins").textContent = format(data.coins, data.format);
		document.getElementById("gain").textContent = format(getGain(), data.format);
		document.getElementById("upgradebtn").textContent = format(getCoinUpgradePrice(), data.format) + " Coins";
		document.getElementById("currentMetaMulti").textContent = format(data.metaBonus, data.format) + "x";
		document.getElementById("afterMetaMulti").textContent = format(getMetaPrestigePoints(), data.format) + "x";
		data.tiers.forEach(function (el, i) {
			document.getElementById("tier"+(i+1)+"btn").textContent = format(data.tiers[i].Cost, data.format) + data.tiers[i].RequirementString;
			document.getElementById("tier"+(i+1)+"a").textContent = format(el.Prestiges, data.format);
			document.getElementById("tier"+(i+1)+"mul").textContent = "x" + format((el.Prestiges.times(1+i).times(el.Multi)), data.format);
			document.getElementById("tier"+(i+1)+"boost").textContent = "Cost: " + format(getTierBoostPrice(i),data.format) + " Coins";
			if (canActivatePrestige(i)) 
				document.getElementById("tier"+(i+1)+"btn").disabled = false;
			else 
				document.getElementById("tier"+(i+1)+"btn").disabled = true;
			if(data.coins.greaterThanOrEqualTo(getCoinUpgradePrice()))
				document.getElementById("upgradebtn").disabled = false;
			else
				document.getElementById("upgradebtn").disabled = true;
			if(data.coins.greaterThanOrEqualTo(getTierBoostPrice(i)))
				document.getElementById("tier"+(i+1)+"boost").disabled = false;
			else
				document.getElementById("tier"+(i+1)+"boost").disabled = true;
			if(getMetaPrestigePoints().greaterThan(data.metaBonus))
				document.getElementById("metaPrestige").disabled = false;
			else
				document.getElementById("metaPrestige").disabled = true;
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
	
	function buyTierBoost(id) {
		if(data.coins.greaterThanOrEqualTo(getTierBoostPrice(id)))
		{
			data.coins = data.coins.sub(getTierBoostPrice(id));
			data.tierBoosts.boosts[id] = data.tierBoosts.boosts[id].add(1);
			data.tierBoosts.boostsCost[id] = data.tierBoosts.boostsCost[id].times(10);
			data.tiers[id].Multi = data.tiers[id].Multi.times(1.5);
			
		}
	}

	window.addEventListener("load",function () {
		if (localStorage.UltimatePrestigeSave === undefined)
			this.localStorage.setItem("UltimatePrestigeSave",JSON.stringify(data));
		else {
			data = JSON.parse(localStorage.UltimatePrestigeSave);
			data.totalCoins = new Decimal(data.totalCoins);
			data.coins = new Decimal(data.coins);
			data.coinupgrades = new Decimal(data.coinupgrades);
			data.coinmulti = new Decimal(data.coinmulti);
			data.metaBonus = new Decimal(data.metaBonus);
			for(var i=0; i<10;i++)
			{
				data.tiers[i].Prestiges = new Decimal(data.tiers[i].Prestiges);
				data.tiers[i].Cost = new Decimal(data.tiers[i].Cost);
				data.tiers[i].Multi = new Decimal(data.tiers[i].Multi);
				data.tierBoosts.boosts[i] = new Decimal(data.tierBoosts.boosts[i]);
				data.tierBoosts.boostsCost[i] = new Decimal(data.tierBoosts.boostsCost[i]);
				if(data.unlocks.tiers[i] === true)
				{
					document.getElementById("tierunlock" + (i+1)).style.display = "table-row";
				}
			}
		}

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

			document.getElementById("tier"+(i+1)+"boost").addEventListener(
				"click",
				(function(n) {
					return (function() {buyTierBoost(n);
					});
				}(i))
			);
		}
		document.getElementById("upgradebtn").addEventListener(
				"click",
				upgradeCoins
		);

		document.getElementById("metaPrestige").addEventListener(
			"click",
			activateMetaprestige
		);
		
		setInterval(function () {
			update();
			draw();
		}, 100);
		console.log("interval loaded");
	});
