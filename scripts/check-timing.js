async function main() {
  console.log("=== MUGEN POAP MINT TIMING VERIFICATION ===\n");
  
  // Same timing as deployment script
  const mintStart = Math.floor(new Date('2025-07-05T02:00:00.000Z').getTime() / 1000);
  const mintEnd = Math.floor(new Date('2025-07-06T03:00:00.000Z').getTime() / 1000);
  
  // Convert to readable dates
  const startDateET = new Date(mintStart * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: 'long',
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const endDateET = new Date(mintEnd * 1000).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: 'long', 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });
  
  const startDateUTC = new Date(mintStart * 1000).toISOString();
  const endDateUTC = new Date(mintEnd * 1000).toISOString();
  const durationHours = Math.floor((mintEnd - mintStart) / 3600);
  
  console.log("📅 MINT START (Eastern Time):");
  console.log("   ", startDateET);
  console.log("");
  console.log("🏁 MINT END (Eastern Time):");
  console.log("   ", endDateET);
  console.log("");
  console.log("🌐 UTC TIMES:");
  console.log("   Start UTC:", startDateUTC);
  console.log("   End UTC:  ", endDateUTC);
  console.log("");
  console.log("⏱️  DURATION:", durationHours, "hours");
  console.log("");
  console.log("🗓️  SUMMARY:");
  console.log("   Minting opens: Friday July 4th at 10:00 PM ET");
  console.log("   Minting closes: Saturday July 5th at 11:00 PM ET");
  console.log("   Total window: 25 hours");
  console.log("");
  
  // Check if timing is in the future
  const now = Math.floor(Date.now() / 1000);
  if (mintStart > now) {
    const hoursUntilStart = Math.floor((mintStart - now) / 3600);
    const daysUntilStart = Math.floor(hoursUntilStart / 24);
    console.log("✅ TIMING STATUS: Future event");
    if (daysUntilStart > 0) {
      console.log(`   Time until mint starts: ${daysUntilStart} days, ${hoursUntilStart % 24} hours`);
    } else {
      console.log(`   Time until mint starts: ${hoursUntilStart} hours`);
    }
  } else if (mintEnd > now) {
    console.log("🟡 TIMING STATUS: Currently minting");
    const hoursLeft = Math.floor((mintEnd - now) / 3600);
    console.log(`   Time remaining: ${hoursLeft} hours`);
  } else {
    console.log("🔴 TIMING STATUS: Mint period has ended");
  }
  
  console.log("");
  console.log("Unix timestamps for verification:");
  console.log("mintStart =", mintStart);
  console.log("mintEnd   =", mintEnd);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 